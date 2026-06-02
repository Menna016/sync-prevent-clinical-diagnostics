#!/usr/bin/env python3
import sys
import json
import os
import math

try:
    import joblib
    import numpy as np
    import pandas as pd
    import sklearn
    HAS_ML_LIBS = True
except ImportError:
    HAS_ML_LIBS = False

def get_bool_field(profile, metrics, key):
    val = metrics.get(key) if metrics.get(key) is not None else profile.get(key)
    if val is None:
        return False
    if isinstance(val, bool):
        return val
    val_str = str(val).strip().lower()
    return val_str in ('true', '1', 'yes')

def main():
    try:
        input_data = json.load(sys.stdin)
    except Exception as e:
        print(json.dumps({"error": f"Failed to parse input JSON: {str(e)}", "risk": "fallback"}))
        return

    model_type = input_data.get("model_type", "heart")

    if not HAS_ML_LIBS:
        print(json.dumps({
            "status": "fallback",
            "message": "Scientific Python libraries (scikit-learn, joblib, pandas) are not installed.",
            "_simulated": True
        }))
        return

    model_filenames = {
        "diabetes": "best_diabetes_model.pkl",
        "bp":       "best_hypertension_gb_model.pkl",
        "kidney":   "best_kidney_gb_model.pkl",
        "heart":    "heart_model.pkl"
    }
    model_file = model_filenames.get(model_type, f"{model_type}_model.pkl")

    model_base = model_file.replace(".pkl", "")
    scaler_possibilities = [
        f"{model_base}_scaler.pkl",
        f"{model_type}_scaler.pkl",
        "scaler.pkl"
    ]
    scaler_file = None
    for path_candidate in scaler_possibilities:
        if os.path.exists(path_candidate):
            scaler_file = path_candidate
            break

    if not os.path.exists(model_file):
        print(json.dumps({
            "status": "fallback",
            "message": f"Model file '{model_file}' was not found.",
            "_simulated": True
        }))
        return

    try:
        model = joblib.load(model_file)
        scaler = None
        if scaler_file is not None:
            try:
                scaler = joblib.load(scaler_file)
            except Exception:
                pass

        FEATURE_DEFAULTS = {

    "heart": {
    "age": 53,
    "gender": 1,
    "height": 165,
    "weight": 72,
    "systolic": 120,
    "diastolic": 80,
    "cholesterol": 1,
    "glucose": 1,
    "ldl": 100,
    "smoke": 0,
    "alcohol": 0,
    "active": 1
    },

    "diabetes": {
        "high_bp": 0,
        "high_chol": 0,
        "chol_check": 1,
        "stroke": 0,
        "heart_disease_or_attack": 0,
        "phys_activity": 1,
        "fruits": 1,
        "veggies": 1,
        "any_healthcare": 1,
        "no_doc_bc_cost": 0,
        "gen_hlth": 2,
        "ment_hlth": 0,
        "phys_hlth": 0,
        "diff_walk": 0,
        "sex": 1,
        "age": 50,
        "education": 5,
        "income": 6,
        "hvy_alcohol_consump": 0,
        "systolic": 120,       # ← أضف
        "diastolic": 80,       # ← أضف
        "ldl": 100,            # ← أضف
        "glucose": 100         # ← أضف
    },

    "bp": {
        "age": 55,
        "salt_intake": 3,
        "stress_score": 4,
        "bp_history": 0,
        "sleep_duration": 7,
        "family_history": 0,
        "exercise_level": 1,
        "smoking_status": 0,
        "systolic": 120,       # ← أضف
        "diastolic": 80,       # ← أضف
        "ldl": 100,            # ← أضف
        "glucose": 100         # ← أضف

    },

    "kidney": {
        "age": 52,
        "creatinine_level": 1.15,
        "bun": 17.5,
        "diabetes": 0,
        "hypertension": 0,
        "gfr": 82.0,
        "urine_output": 1.6,
        "systolic": 120,       # ← أضف
    "diastolic": 80,       # ← أضف
    "ldl": 100,            # ← أضف
    "glucose": 100         # ← أضف
    }

}
        defaults = FEATURE_DEFAULTS.get(model_type, FEATURE_DEFAULTS["heart"])
        
        profile = input_data.get("profile", {})
        metrics = input_data.get("metrics", {})

        # ── shared basics ──────────────────────────────────────────────────────
        height_raw = profile.get("height")
        height = float(height_raw) if height_raw and str(height_raw).strip() != "" else defaults["height"]

        weight_raw = profile.get("weight")
        weight = float(weight_raw) if weight_raw and str(weight_raw).strip() != "" else defaults["weight"]

        bmi = weight / ((height / 100.0) ** 2) if height > 0 else 24.5

        age_raw = profile.get("age")
        age = int(float(age_raw)) if age_raw and str(age_raw).strip() != "" else defaults["age"]

        gender_str = str(profile.get("gender", "Male")).lower()
        gender = 2 if "male" in gender_str else 1

        bp_str = str(metrics.get("bloodPressure", "")).strip()
        systolic  = defaults["systolic"]
        diastolic = defaults["diastolic"]
        if "/" in bp_str:
            try:
                parts = bp_str.split("/")
                systolic  = float(parts[0].strip())
                diastolic = float(parts[1].strip())
            except Exception:
                pass
        else:
            sys_val = metrics.get("systolic")
            dia_val = metrics.get("diastolic")
            if sys_val and str(sys_val).strip() != "":
                systolic = float(sys_val)
            if dia_val and str(dia_val).strip() != "":
                diastolic = float(dia_val)

        ldl_val = metrics.get("ldlCholesterol")
        ldl = float(ldl_val) if ldl_val and str(ldl_val).strip() != "" else defaults["ldl"]
        cholesterol = 1 if ldl < 100 else (2 if ldl < 160 else 3)

        gluc_val = metrics.get("bloodGlucose")
        glucose_val = float(gluc_val) if gluc_val and str(gluc_val).strip() != "" else defaults["glucose"]
        glucose = 1 if glucose_val < 100 else (2 if glucose_val < 126 else 3)

        smoke   = 1 if profile.get("smoke") is True or str(profile.get("smoke","")).lower() == 'true' else 0
        alcohol = 1 if profile.get("alcohol") is True or str(profile.get("alcohol","")).lower() == 'true' else 0
        activity_str = str(profile.get("activityLevel", "Moderate")).lower()
        active = 0 if "sedentary" in activity_str else 1

        # ── HEART ──────────────────────────────────────────────────────────────
        if model_type == "heart":
            age_val      = float(metrics.get("age",      age))
            gender_val   = float(metrics.get("gender",   gender))
            height_val   = float(metrics.get("height",   height))
            weight_val   = float(metrics.get("weight",   weight))
            systolic_val = float(metrics.get("systolic", systolic))
            diastolic_val= float(metrics.get("diastolic",diastolic))
            chol_val     = float(metrics.get("cholesterol", cholesterol))
            gluc_val2    = float(metrics.get("glucose",  glucose))
            smoke_val    = float(metrics.get("smoke",    smoke))
            alc_val      = float(metrics.get("alcohol",  alcohol))
            act_val      = float(metrics.get("active",   active))

            features = [age_val, gender_val, height_val, weight_val,
                        systolic_val, diastolic_val, chol_val, gluc_val2,
                        smoke_val, alc_val, act_val, float(bmi)]

            feature_report = {
                "age": age_val, "gender": gender_val,
                "height": height_val, "weight": weight_val,
                "systolic": systolic_val, "diastolic": diastolic_val,
                "cholesterol": chol_val, "glucose": gluc_val2,
                "smoke": smoke_val, "alcohol": alc_val,
                "active": act_val, "bmi": round(bmi, 2)
            }

            val_map = {
                "age": age_val, "gender": gender_val,
                "height": height_val, "weight": weight_val,
                "bmi": float(bmi),
                "smoke": smoke_val, "smoker": smoke_val,
                "alcohol": alc_val, "alco": alc_val,
                "active": act_val,
                "systolic": systolic_val, "ap_hi": systolic_val,
                "diastolic": diastolic_val, "ap_lo": diastolic_val,
                "cholesterol": chol_val, "glucose": gluc_val2,
            }

        # ── DIABETES ───────────────────────────────────────────────────────────
        elif model_type == "diabetes":
            high_bp_val   = float(metrics.get("high_bp",   metrics.get("HighBP",   1.0 if (systolic >= 130 or diastolic >= 80 or get_bool_field(profile, metrics, "high_bp_history")) else 0.0)))
            high_chol_val = float(metrics.get("high_chol", metrics.get("HighChol", 1.0 if (ldl > 120 or get_bool_field(profile, metrics, "high_chol_history")) else 0.0)))
            chol_check_val= float(metrics.get("chol_check",metrics.get("CholCheck", 1.0)))
            stroke_val    = float(metrics.get("stroke",     metrics.get("Stroke",    1.0 if get_bool_field(profile, metrics, "stroke_history") else 0.0)))
            hd_attack_val = float(metrics.get("heart_disease_or_attack", metrics.get("HeartDiseaseorAttack", 1.0 if get_bool_field(profile, metrics, "heart_history") else 0.0)))
            phys_act_val  = float(metrics.get("phys_activity", metrics.get("PhysActivity", float(active))))
            fruits_val    = float(metrics.get("fruits",   metrics.get("Fruits",   1.0)))
            veggies_val   = float(metrics.get("veggies",  metrics.get("Veggies",  1.0)))
            hc_val        = float(metrics.get("any_healthcare", metrics.get("AnyHealthcare", 1.0)))
            nodoc_val     = float(metrics.get("no_doc_bc_cost", metrics.get("NoDocbcCost",  0.0)))
            gen_hlth_val  = float(metrics.get("gen_hlth",  metrics.get("GenHlth",  2.0)))
            ment_hlth_val = float(metrics.get("ment_hlth", metrics.get("MentHlth", 0.0)))
            phys_hlth_val = float(metrics.get("phys_hlth", metrics.get("PhysHlth", 0.0)))
            diff_walk_val = float(metrics.get("diff_walk", metrics.get("DiffWalk", 0.0)))
            sex_val       = float(metrics.get("sex",       metrics.get("Sex",       1.0 if "male" in gender_str else 0.0)))
            age_val       = float(metrics.get("age",       metrics.get("Age",       float(age))))
            edu_val       = float(metrics.get("education", metrics.get("Education", 5.0)))
            inc_val       = float(metrics.get("income",    metrics.get("Income",    6.0)))
            hvy_alc_val   = float(metrics.get("hvy_alcohol_consump", metrics.get("HvyAlcoholConsump", float(alcohol))))

            features = [high_bp_val, high_chol_val, chol_check_val, float(bmi),
                        float(smoke), stroke_val, hd_attack_val, phys_act_val,
                        fruits_val, veggies_val, hvy_alc_val, hc_val, nodoc_val,
                        gen_hlth_val, ment_hlth_val, phys_hlth_val, diff_walk_val,
                        sex_val, age_val, edu_val, inc_val]

            feature_report = {
                "high_bp": int(high_bp_val), "high_chol": int(high_chol_val),
                "chol_check": int(chol_check_val), "bmi": round(bmi, 2),
                "smoker": int(smoke), "stroke": int(stroke_val),
                "heart_disease_or_attack": int(hd_attack_val),
                "phys_activity": int(phys_act_val), "fruits": int(fruits_val),
                "veggies": int(veggies_val), "hvy_alcohol_consump": int(hvy_alc_val),
                "any_healthcare": int(hc_val), "no_doc_bc_cost": int(nodoc_val),
                "gen_hlth": int(gen_hlth_val), "ment_hlth": int(ment_hlth_val),
                "phys_hlth": int(phys_hlth_val), "diff_walk": int(diff_walk_val),
                "sex": int(sex_val), "age": int(age_val),
                "education": int(edu_val), "income": int(inc_val)
            }

            val_map = {
                "age": age_val, "age_val": age_val,
                "bmi": float(bmi),
                "smoke": float(smoke), "smoker": float(smoke),
                "alcohol": float(alcohol), "alco": float(alcohol),
                "active": float(active),
                "high_bp": high_bp_val, "highbp": high_bp_val,
                "high_chol": high_chol_val, "highchol": high_chol_val,
                "chol_check": chol_check_val, "cholcheck": chol_check_val,
                "stroke": stroke_val,
                "heart_disease_or_attack": hd_attack_val, "heartdiseaseorattack": hd_attack_val,
                "phys_activity": phys_act_val, "physactivity": phys_act_val,
                "fruits": fruits_val, "veggies": veggies_val,
                "hvy_alcohol_consump": hvy_alc_val, "hvyalcoholconsump": hvy_alc_val,
                "any_healthcare": hc_val, "anyhealthcare": hc_val,
                "no_doc_bc_cost": nodoc_val, "nodocbccost": nodoc_val,
                "gen_hlth": gen_hlth_val, "genhlth": gen_hlth_val,
                "ment_hlth": ment_hlth_val, "menthlth": ment_hlth_val,
                "phys_hlth": phys_hlth_val, "physhlth": phys_hlth_val,
                "diff_walk": diff_walk_val, "diffwalk": diff_walk_val,
                "sex": sex_val, "education": edu_val, "income": inc_val,
            }

        # ── BP / HYPERTENSION ──────────────────────────────────────────────────
        elif model_type == "bp":
            age_val         = float(metrics.get("age",            metrics.get("Age",            float(age))))
            salt            = float(metrics.get("salt_intake",    metrics.get("Salt_Intake",    3.0)))
            stress          = float(metrics.get("stress_score",   metrics.get("Stress_Score",   4.0)))
            bp_hist_val     = float(metrics.get("bp_history",     metrics.get("BP_History",     0.0)))
            sleep           = float(metrics.get("sleep_duration", metrics.get("Sleep_Duration", 7.0)))
            fam_hist_val    = float(metrics.get("family_history", metrics.get("Family_History", 0.0)))
            ex_lvl_val      = float(metrics.get("exercise_level", metrics.get("Exercise_Level", float(active))))
            smoke_status_val= float(metrics.get("smoking_status", metrics.get("Smoking_Status", float(smoke))))

            features = [age_val, salt, stress, bp_hist_val, sleep,
                        fam_hist_val, ex_lvl_val, smoke_status_val]

            feature_report = {
                "age": int(age_val), "salt_intake": salt,
                "stress_score": stress, "bp_history": int(bp_hist_val),
                "sleep_duration": sleep,
                "family_history": int(fam_hist_val),
                "exercise_level": int(ex_lvl_val),
                "smoking_status": int(smoke_status_val)
            }

            val_map = {
                "age": age_val,
                "smoke": float(smoke), "smoker": float(smoke),
                "smoking_status": smoke_status_val, "smokingstatus": smoke_status_val,
                "alcohol": float(alcohol), "alco": float(alcohol),
                "active": float(active),
                "salt_intake": salt, "salt": salt,
                "stress_score": stress, "stress": stress,
                "bp_history": bp_hist_val, "bphistory": bp_hist_val,
                "sleep_duration": sleep, "sleep": sleep,
                "family_history": fam_hist_val, "familyhistory": fam_hist_val,
                "exercise_level": ex_lvl_val, "exerciselevel": ex_lvl_val,
            }

        # ── KIDNEY ─────────────────────────────────────────────────────────────
        else:  # model_type == "kidney"
            age_val  = float(metrics.get("age",              metrics.get("Age",              float(age))))
            creat    = float(metrics.get("creatinine_level", metrics.get("Creatinine_Level", 1.15)))
            bun_val  = float(metrics.get("bun",              metrics.get("BUN",              17.5)))
            diab_val = float(metrics.get("diabetes",         metrics.get("Diabetes",         1.0 if (glucose_val >= 126 or get_bool_field(profile, metrics, "diabetes_history")) else 0.0)))
            ht_val   = float(metrics.get("hypertension",     metrics.get("Hypertension",     1.0 if (systolic >= 130 or diastolic >= 80 or get_bool_field(profile, metrics, "hypertension_history")) else 0.0)))
            gfr_val  = float(metrics.get("gfr",              metrics.get("GFR",              82.0)))
            urine_val= float(metrics.get("urine_output",     metrics.get("Urine_Output",     1.6)))

            features = [age_val, creat, bun_val, diab_val, ht_val, gfr_val, urine_val]

            feature_report = {
                "age": int(age_val), "creatinine_level": creat,
                "bun": bun_val, "diabetes": int(diab_val),
                "hypertension": int(ht_val), "gfr": gfr_val,
                "urine_output": urine_val
            }

            val_map = {
                "age": age_val,
                "bmi": float(bmi),
                "smoke": float(smoke), "smoker": float(smoke),
                "alcohol": float(alcohol), "alco": float(alcohol),
                "active": float(active),
                "creatinine_level": creat, "creatinine": creat,
                "bun": bun_val,
                "diabetes": diab_val,
                "hypertension": ht_val,
                "gfr": gfr_val,
                "urine_output": urine_val, "urine": urine_val,
            }

        # ── Feature alignment + scaling + prediction ───────────────────────────
        features_arr = np.array(features).reshape(1, -1)

        feature_names = getattr(model, "feature_names_in_", None)
        if feature_names is not None:
            mapped_values = []
            for col in feature_names:
                col_lower = col.lower().replace("_", "").replace(" ", "")
                val = None
                if col in val_map:
                    val = val_map[col]
                elif col.lower() in val_map:
                    val = val_map[col.lower()]
                else:
                    for k, v in val_map.items():
                        if k.lower().replace("_", "").replace(" ", "") == col_lower:
                            val = v
                            break
                if val is None:
                    val = 0.0
                mapped_values.append(val)

            features_df = pd.DataFrame([mapped_values], columns=feature_names)

            if scaler is not None:
                try:
                    scaler_features = getattr(scaler, "feature_names_in_", None)
                    if scaler_features is not None:
                        scaler_vals = []
                        for scol in scaler_features:
                            scol_lower = scol.lower().replace("_", "").replace(" ", "")
                            sval = None
                            if scol in val_map:
                                sval = val_map[scol]
                            elif scol.lower() in val_map:
                                sval = val_map[scol.lower()]
                            else:
                                for k, v in val_map.items():
                                    if k.lower().replace("_", "").replace(" ", "") == scol_lower:
                                        sval = v
                                        break
                            if sval is None:
                                sval = 0.0
                            scaler_vals.append(sval)
                        scaler_df = pd.DataFrame([scaler_vals], columns=scaler_features)
                        features_scaled = scaler.transform(scaler_df)
                    else:
                        features_scaled = scaler.transform(features_df)
                except Exception:
                    features_scaled = features_df
            else:
                features_scaled = features_df
        else:
            if scaler is not None:
                try:
                    features_scaled = scaler.transform(features_arr)
                except Exception:
                    features_scaled = features_arr
            else:
                features_scaled = features_arr

        # Prediction
        prob = None
        predict_class = None
        try:
            try:
                prob = model.predict_proba(features_scaled)[0][1]
            except Exception:
                arr = features_scaled.to_numpy() if hasattr(features_scaled, "to_numpy") else np.array(features_scaled)
                prob = model.predict_proba(arr)[0][1]
        except Exception:
            try:
                arr = features_scaled.to_numpy() if hasattr(features_scaled, "to_numpy") else np.array(features_scaled)
                predict_class = int(model.predict(arr)[0])
                prob = 0.85 if predict_class == 1 else 0.15
            except Exception as pred_err:
                raise RuntimeError(f"Model prediction failed: {str(pred_err)}")

        if predict_class is None:
            predict_class = 1 if prob >= 0.5 else 0

        risk_level = "Low" if prob < 0.35 else ("Medium" if prob < 0.65 else "High")

        print(json.dumps({
            "status": "success",
            "riskLevel": risk_level,
            "probability": prob,
            "predictionClass": predict_class,
            "features": feature_report
        }))

    except Exception as run_err:
        print(json.dumps({
            "status": "error",
            "message": f"ML Inference pipeline error: {str(run_err)}",
            "_simulated": True
        }))

if __name__ == "__main__":
    main()