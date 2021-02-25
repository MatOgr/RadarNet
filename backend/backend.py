from flask import Flask, request, jsonify, abort
from flask_mysqldb import MySQL
import os
from flask_cors import CORS
from uuid import uuid4 as uuid

app = Flask(__name__)

app.config['MYSQL_USER'] = 'marek'
app.config['MYSQL_PASSWORD'] = 'GogMiauiGR_98'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_DB'] = 'radars'
# app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

CORS(app)
basedir = os.path.abspath(os.path.dirname(__file__))

errorLUT = {
    1146: "Tabela o podanej nazwie nie istnieje!",
    1451: "Nie można usunąć obiektu, gdyż odwołują się do niego inne obiekty!",
    1644: "Invalid data for the chosen product type!"
}

# db = SQLAlchemy(app)

@app.route("/endpoint", methods=["POST"])
def handleRequests():
    action = request.json.get("action")
    print(f"action {action}")
    print(request.json)
    cur = mysql.connection.cursor()
    if action == "add":
        if request.json.get('table') == "Composites":
            merge_type = request.json.get("merge_type")
            try:
                cur.execute(f"INSERT INTO Composites VALUES (NULL, '{merge_type}');")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Networks":
            network_name = request.json.get("network_name")
            org_id = request.json.get("org_id")
            try:
                cur.execute(f"INSERT INTO Networks VALUES (NULL, '{network_name}', {org_id});")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Organisations":
            organisation_name = request.json.get("organisation_name")
            attribution = request.json.get("attribution")

            org_url = request.json.get("org_url")
            if org_url == '': org_url = "NULL"

            logo_url = request.json.get("logo_url")
            if logo_url == '': logo_url = "NULL"

            try:
                # print(org_url, logo_url)
                cur.execute(f"INSERT INTO Organisations VALUES (NULL, '{organisation_name}', '{attribution}', {org_url}, {logo_url});")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Products":
            product_type = request.json.get("product_type")
            if product_type is None: product_type = 'NULL'

            dtype = request.json.get("dtype")
            if dtype is None: dtype = 'NULL'

            scan_used_id = request.json.get("scan_used_id")
            if scan_used_id is None: scan_used_id = 'NULL'
            
            radar_used_id = request.json.get("radar_used_id")
            if radar_used_id is None: radar_used_id = 'NULL'

            composite_used_id = request.json.get("composite_used_id")
            if composite_used_id is None: composite_used_id = 'NULL'

            hmin = request.json.get("hmin")
            if hmin == '': hmin = 'NULL'
            
            hmax = request.json.get("hmax")
            if hmax == '': hmax = 'NULL'

            zr_relation = request.json.get("zr_relation")
            if zr_relation == '': zr_relation = 'NULL'

            height = request.json.get("height")
            if height == '': height = 'NULL'

            r_min = request.json.get("r_min")
            if r_min == '': r_min = 'NULL'

            r_max = request.json.get("r_max")
            if r_max == '': r_max = 'NULL'

            posangle = request.json.get("posangle")
            if posangle == '': posangle = 'NULL'

            try:
                # print(org_url, logo_url)
                if(zr_relation == 'NULL'):
                    cur.execute(f"INSERT INTO Products VALUES (NULL, '{product_type}', '{dtype}', {scan_used_id}, {radar_used_id}, {composite_used_id}, {hmin}, {hmax}, NULL, {height}, {r_min}, {r_max}, {posangle});")
                else:
                    cur.execute(f"INSERT INTO Products VALUES (NULL, '{product_type}', '{dtype}', {scan_used_id}, {radar_used_id}, {composite_used_id}, {hmin}, {hmax}, '{zr_relation}', {height}, {r_min}, {r_max}, {posangle});")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Radar_users":
            user_login = request.json.get("user_login")
            if user_login is None: user_login = 'NULL'

            user_password = request.json.get("user_password")
            if user_password is None: user_password = 'NULL'

            fname = request.json.get("fname")
            if fname is None: fname = 'NULL'
            
            sname = request.json.get("sname")
            if sname is None: sname = 'NULL'

            api_key = str(uuid())

            if user_login == 'NULL' or user_password == 'NULL' or fname == 'NULL' or sname == 'NULL':
                return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            try:
                # print(org_url, logo_url)
                cur.execute(f"INSERT INTO Radar_users VALUES (NULL, '{user_login}', '{user_password}', '{fname}', '{sname}', CURDATE(), '{api_key}');")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Radars":
            radar_name = request.json.get("radar_name")
            if radar_name is None or radar_name == '': radar_name = 'NULL'

            lon = request.json.get("lon")
            if lon is None or lon == '': lon = 'NULL'

            lat = request.json.get("lat")
            if lat is None or lat == '': lat = 'NULL'
            
            elev_asl = request.json.get("elev_asl")
            if elev_asl is None or elev_asl == '': elev_asl = 'NULL'

            is_dp = request.json.get("is_dp")
            if is_dp is None or is_dp == '': is_dp = 'NULL'

            is_doppler = request.json.get("is_doppler")
            if is_doppler is None or is_doppler == '': is_doppler = 'NULL'

            net_id = request.json.get("net_id")
            if net_id is None or net_id == '': net_id = 'NULL'

            if radar_name == "NULL": return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            # print(f"(NULL, '{radar_name}', {lon}, {lat}, {elev_asl}, {is_dp}, {is_doppler}, {net_id})")
            try:
                # print(org_url, logo_url)
                cur.execute(f"INSERT INTO Radars VALUES (NULL, '{radar_name}', {lon}, {lat}, {elev_asl}, {is_dp}, {is_doppler}, {net_id});")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Scales":
            scale_name = request.json.get("scale_name")
            if scale_name is None or scale_name == '': scale_name = 'NULL'

            vmin = request.json.get("vmin")
            if vmin is None or vmin == '': vmin = 'NULL'

            vmax = request.json.get("vmax")
            if vmax is None or vmax == '': vmax = 'NULL'

            if scale_name == 'NULL' or vmin == 'NULL' or vmax == 'NULL':
                return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            try:
                # print(org_url, logo_url)
                cur.execute(f"INSERT INTO Scales VALUES (NULL, '{scale_name}', {vmin}, {vmax});")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})

        elif request.json.get('table') == "Scans":
            scan_range = request.json.get("scan_range")
            if scan_range is None or scan_range == '': scan_range = 'NULL'

            lowprf = request.json.get("lowprf")
            if lowprf is None or lowprf == '': lowprf = 'NULL'

            highprf = request.json.get("highprf")
            if highprf is None or highprf == '': highprf = 'NULL'

            dbz_on = request.json.get("dbzon")
            if dbz_on is None or dbz_on == '': dbz_on = 'NULL'

            dbuz_on = request.json.get("dbuzon")
            if dbuz_on is None or dbuz_on == '': dbuz_on = 'NULL'

            v_on = request.json.get("von")
            if v_on is None or v_on == '': v_on = 'NULL'

            w_on = request.json.get("won")
            if w_on is None or w_on == '': w_on = 'NULL'

            rhohv_on = request.json.get("rhohvon")
            if rhohv_on is None or rhohv_on == '': rhohv_on = 'NULL'

            kdp_on = request.json.get("kdpon")
            if kdp_on is None or kdp_on == '': kdp_on = 'NULL'

            phidp_on = request.json.get("phidpon")
            if phidp_on is None or phidp_on == '': phidp_on = 'NULL'

            zdr_on = request.json.get("zdron")
            if zdr_on is None or zdr_on == '': zdr_on = 'NULL'

            rad_id = request.json.get("rad_id")
            if rad_id is None or rad_id == '': rad_id = 'NULL'

            try:
                # print(org_url, logo_url)
                cur.execute(f"INSERT INTO Scans VALUES (NULL, {scan_range}, {lowprf}, {highprf}, {dbz_on}, {dbuz_on}, {v_on}, {w_on}, {rhohv_on}, {kdp_on}, {phidp_on}, {zdr_on}, {rad_id});")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})

        elif request.json.get('table') == "relation_composite_user":
            composite_rel_id = request.json.get("composite_rel_id")
            if composite_rel_id is None or composite_rel_id == '': composite_rel_id = 'NULL'

            user_rel_id = request.json.get("user_rel_id")
            if user_rel_id is None or user_rel_id == '': user_rel_id = 'NULL'

            if composite_rel_id == 'NULL' or user_rel_id == 'NULL':
                return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            try:
                # print(org_url, logo_url)
                cur.execute(f"INSERT INTO relation_composite_user VALUES ({composite_rel_id}, {user_rel_id});")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})

            return jsonify({"status": "OK"})
    
        elif request.json.get('table') == "relation_product_user":
            product_rel_id = request.json.get("product_rel_id")
            if product_rel_id is None or product_rel_id == '': product_rel_id = 'NULL'

            user_rel_id = request.json.get("user_rel_id")
            if user_rel_id is None or user_rel_id == '': user_rel_id = 'NULL'

            if product_rel_id == 'NULL' or user_rel_id == 'NULL':
                return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            try:
                # print(org_url, logo_url)
                cur.execute(f"INSERT INTO relation_product_user VALUES ({product_rel_id}, {user_rel_id});")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})
                    
            return jsonify({"status": "OK"})

    if action == "edit":
        if request.json.get('table') == "Composites":
            merge_type = request.json.get("merge_type")
            id = request.json.get("id")
            try:
                cur.execute(f"UPDATE Composites SET merge_type='{merge_type}' WHERE composite_id={id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Networks":
            network_name = request.json.get("network_name")
            org_id = request.json.get("org_id")
            id = request.json.get("id")
            try:
                cur.execute(f"UPDATE Networks SET network_name='{network_name}', org_id={org_id} WHERE network_id={id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Organisations":
            organisation_name = request.json.get("organisation_name")
            attribution = request.json.get("attribution")
            id = request.json.get("id")

            org_url = request.json.get("org_url")

            logo_url = request.json.get("logo_url")

            try:
                # print(org_url, logo_url)
                cur.execute(f"UPDATE Organisations SET organisation_name='{organisation_name}', attribution='{attribution}', org_url='{org_url}', logo='{logo_url}' WHERE organisation_id={id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Products":
            product_type = request.json.get("product_type")
            if product_type is None: product_type = 'NULL'

            dtype = request.json.get("dtype")
            if dtype is None: dtype = 'NULL'

            scan_used_id = request.json.get("scan_used_id")
            if scan_used_id is None: scan_used_id = 'NULL'
            
            radar_used_id = request.json.get("radar_used_id")
            if radar_used_id is None: radar_used_id = 'NULL'

            composite_used_id = request.json.get("composite_used_id")
            if composite_used_id is None: composite_used_id = 'NULL'

            hmin = request.json.get("hmin")
            if hmin == '': hmin = 'NULL'
            
            hmax = request.json.get("hmax")
            if hmax == '': hmax = 'NULL'

            zr_relation = request.json.get("zr_relation")
            if zr_relation == '': zr_relation = 'NULL'

            height = request.json.get("height")
            if height == '': height = 'NULL'

            r_min = request.json.get("r_min")
            if r_min == '': r_min = 'NULL'

            r_max = request.json.get("r_max")
            if r_max == '': r_max = 'NULL'

            posangle = request.json.get("posangle")
            if posangle == '': posangle = 'NULL'

            id = request.json.get("id")

            try:
                # print(org_url, logo_url)
                if(zr_relation == 'NULL'):
                    cur.execute(f"UPDATE Products SET product_type='{product_type}', dtype='{dtype}', scan_used_id={scan_used_id}, radar_used_id={radar_used_id}, composite_used_id={composite_used_id}, hmin={hmin}, hmax={hmax}, zr_relation={zr_relation}, height={height}, r_min={r_min}, r_max={r_max}, posangle={posangle} WHERE product_id={id};")
                else:
                    cur.execute(f"UPDATE Products SET product_type='{product_type}', dtype='{dtype}', scan_used_id={scan_used_id}, radar_used_id={radar_used_id}, composite_used_id={composite_used_id}, hmin={hmin}, hmax={hmax}, zr_relation='{zr_relation}', height={height}, r_min={r_min}, r_max={r_max}, posangle={posangle} WHERE product_id={id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Radar_users":
            user_login = request.json.get("user_login")
            if user_login is None: user_login = 'NULL'

            user_password = request.json.get("user_password")
            if user_password is None: user_password = 'NULL'

            fname = request.json.get("fname")
            if fname is None: fname = 'NULL'
            
            sname = request.json.get("sname")
            if sname is None: sname = 'NULL'

            api_key = str(uuid())

            id = request.json.get("id")

            if user_login == 'NULL' or user_password == 'NULL' or fname == 'NULL' or sname == 'NULL':
                return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            try:
                # print(org_url, logo_url)
                cur.execute(f"UPDATE Radar_users SET user_login='{user_login}', user_password='{user_password}', fname='{fname}', sname='{sname}' WHERE user_id={id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Radars":
            radar_name = request.json.get("radar_name")
            if radar_name is None or radar_name == '': radar_name = 'NULL'

            lon = request.json.get("lon")
            if lon is None or lon == '': lon = 'NULL'

            lat = request.json.get("lat")
            if lat is None or lat == '': lat = 'NULL'
            
            elev_asl = request.json.get("elev_asl")
            if elev_asl is None or elev_asl == '': elev_asl = 'NULL'

            is_dp = request.json.get("is_dp")
            if is_dp is None or is_dp == '': is_dp = 'NULL'

            is_doppler = request.json.get("is_doppler")
            if is_doppler is None or is_doppler == '': is_doppler = 'NULL'

            net_id = request.json.get("net_id")
            if net_id is None or net_id == '': net_id = 'NULL'

            id = request.json.get("id")

            if radar_name == "NULL": return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            # print(f"(NULL, '{radar_name}', {lon}, {lat}, {elev_asl}, {is_dp}, {is_doppler}, {net_id})")
            try:
                # print(org_url, logo_url)
                cur.execute(f"UPDATE Radars SET radar_name='{radar_name}', lon={lon}, lat={lat}, elev_asl={elev_asl}, is_dp={is_dp}, is_doppler={is_doppler}, net_id={net_id} WHERE radar_id={id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})
            
            return jsonify({"status": "OK"})

        elif request.json.get('table') == "Scales":
            scale_name = request.json.get("scale_name")
            if scale_name is None or scale_name == '': scale_name = 'NULL'

            vmin = request.json.get("vmin")
            if vmin is None or vmin == '': vmin = 'NULL'

            vmax = request.json.get("vmax")
            if vmax is None or vmax == '': vmax = 'NULL'

            id = request.json.get("id")

            if scale_name == 'NULL' or vmin == 'NULL' or vmax == 'NULL':
                return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            try:
                # print(org_url, logo_url)
                cur.execute(f"UPDATE Scales SET scale_name='{scale_name}', vmin={vmin}, vmax={vmax} WHERE scale_id={id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})

        elif request.json.get('table') == "Scans":
            scan_range = request.json.get("scan_range")
            if scan_range is None or scan_range == '': scan_range = 'NULL'

            lowprf = request.json.get("lowprf")
            if lowprf is None or lowprf == '': lowprf = 'NULL'

            highprf = request.json.get("highprf")
            if highprf is None or highprf == '': highprf = 'NULL'

            dbz_on = request.json.get("dbzon")
            if dbz_on is None or dbz_on == '': dbz_on = 'NULL'

            dbuz_on = request.json.get("dbuzon")
            if dbuz_on is None or dbuz_on == '': dbuz_on = 'NULL'

            v_on = request.json.get("von")
            if v_on is None or v_on == '': v_on = 'NULL'

            w_on = request.json.get("won")
            if w_on is None or w_on == '': w_on = 'NULL'

            rhohv_on = request.json.get("rhohvon")
            if rhohv_on is None or rhohv_on == '': rhohv_on = 'NULL'

            kdp_on = request.json.get("kdpon")
            if kdp_on is None or kdp_on == '': kdp_on = 'NULL'

            phidp_on = request.json.get("phidpon")
            if phidp_on is None or phidp_on == '': phidp_on = 'NULL'

            zdr_on = request.json.get("zdron")
            if zdr_on is None or zdr_on == '': zdr_on = 'NULL'

            rad_id = request.json.get("rad_id")
            if rad_id is None or rad_id == '': rad_id = 'NULL'

            id = request.json.get("id")

            try:
                # print(org_url, logo_url)
                cur.execute(f"UPDATE Scans SET scan_range={scan_range}, lowprf={lowprf}, highprf={highprf}, dbz_on={dbz_on}, dbuz_on={dbuz_on}, v_on={v_on}, w_on={w_on}, rhohv_on={rhohv_on}, kdp_on={kdp_on}, phidp_on={phidp_on}, zdr_on={zdr_on}, rad_id={rad_id} WHERE scan_id={id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})

    if action == "delete":
        id = request.json.get("id")
        table = request.json.get("table")
        if table == "Composites":
            try:
                cur.execute(f"DELETE FROM Composites WHERE composite_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})
        
        if table == "Networks":
            try:
                cur.execute(f"DELETE FROM Networks WHERE network_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})
        
        if table == "Organisations":
            try:
                cur.execute(f"DELETE FROM Organisations WHERE organisation_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})

        if table == "Products":
            try:
                cur.execute(f"DELETE FROM Products WHERE product_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})

        if table == "Radar_users":
            try:
                cur.execute(f"DELETE FROM Radar_users WHERE user_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})

        if table == "Radars":
            try:
                cur.execute(f"DELETE FROM Radars WHERE radar_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})

        if table == "Scales":
            try:
                cur.execute(f"DELETE FROM Scales WHERE scale_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})

        if table == "Scans":
            try:
                cur.execute(f"DELETE FROM Scans WHERE scan_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})

        if table == "Images":
            try:
                cur.execute(f"DELETE FROM Images WHERE image_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})

        if table == "Volumes":
            try:
                cur.execute(f"DELETE FROM Volumes WHERE volume_id = {id}")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            return jsonify({"status": "OK"})

        if request.json.get('table') == "relation_composite_user":
            composite_rel_id = request.json.get("id1")
            if composite_rel_id is None or composite_rel_id == '': composite_rel_id = 'NULL'

            user_rel_id = request.json.get("id2")
            if user_rel_id is None or user_rel_id == '': user_rel_id = 'NULL'

            if composite_rel_id == 'NULL' or user_rel_id == 'NULL':
                return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            try:
                # print(org_url, logo_url)
                cur.execute(f"DELETE FROM relation_composite_user WHERE composite_rel_id={composite_rel_id} AND user_rel_id={user_rel_id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})

            return jsonify({"status": "OK"})

        if request.json.get('table') == "relation_product_user":
            product_rel_id = request.json.get("id1")
            if product_rel_id is None or product_rel_id == '': product_rel_id = 'NULL'

            user_rel_id = request.json.get("id2")
            if user_rel_id is None or user_rel_id == '': user_rel_id = 'NULL'

            if product_rel_id == 'NULL' or user_rel_id == 'NULL':
                return jsonify({"status": "ERROR", "details": "Missing attributes!"})

            try:
                # print(org_url, logo_url)
                cur.execute(f"DELETE FROM relation_product_user WHERE product_rel_id={product_rel_id} AND user_rel_id={user_rel_id};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})

            return jsonify({"status": "OK"})

    if action == "search":
        conditions = []
        if request.json.get('table') == "Composites":
            merge_type = request.json.get("merge_type")
            # id = request.json.get("id")
            try:
                cur.execute(f"SELECT * FROM Composites WHERE merge_type='{merge_type}';")
                # mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            ret = cur.fetchall()
            return jsonify({"status": "found", "payload": ret})

        elif request.json.get('table') == "Networks":
            network_name = request.json.get("network_name")
            if network_name != '': conditions.append(f"network_name='{network_name}'")

            org_id = request.json.get("org_id")
            if org_id != '': conditions.append(f"org_id={org_id}")

            condStr = " AND ".join(conditions)

            # print(f"SELECT FROM Networks WHERE {condStr};")

            try:
                cur.execute(f"SELECT * FROM Networks WHERE {condStr};")
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            ret = cur.fetchall()
            return jsonify({"status": "found", "payload": ret})

        elif request.json.get('table') == "Organisations":
            organisation_name = request.json.get("organisation_name")
            if organisation_name != '': conditions.append(f"organisation_name='{organisation_name}'")

            attribution = request.json.get("attribution")
            if attribution != '': conditions.append(f"attribution={attribution}")

            org_url = request.json.get("org_url")
            if org_url != '': conditions.append(f"org_url='{org_url}'")

            logo_url = request.json.get("logo_url")
            if logo_url != '': conditions.append(f"logo_url={logo_url}")

            condStr = " AND ".join(conditions)

            print(condStr)

            try:
                # print(org_url, logo_url)
                cur.execute(f"SELECT * FROM Organisations WHERE {condStr};")
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            ret = cur.fetchall()
            return jsonify({"status": "found", "payload": ret})

        elif request.json.get('table') == "Products":
            product_type = request.json.get("product_type")
            if not product_type is None: conditions.append(f"product_type='{product_type}'")

            dtype = request.json.get("dtype")
            if not dtype is None: conditions.append(f"dtype='{dtype}'")

            scan_used_id = request.json.get("scan_used_id")
            if not scan_used_id is None: conditions.append(f"scan_used_id={scan_used_id}")
            
            radar_used_id = request.json.get("radar_used_id")
            if not radar_used_id is None: conditions.append(f"radar_used_id={radar_used_id}")

            composite_used_id = request.json.get("composite_used_id")
            if not composite_used_id is None: conditions.append(f"composite_used_id={composite_used_id}")

            hmin = request.json.get("hmin")
            if not hmin == '': conditions.append(f"hmin={hmin}")
            
            hmax = request.json.get("hmax")
            if not hmax == '': conditions.append(f"hmax={hmax}")

            zr_relation = request.json.get("zr_relation")
            if not zr_relation == '': conditions.append(f"zr_relation='{zr-relation}'")

            height = request.json.get("height")
            if not height == '': conditions.append(f"height={height}")

            r_min = request.json.get("r_min")
            if not r_min == '': conditions.append(f"r_min={r_min}")

            r_max = request.json.get("r_max")
            if not r_max == '': conditions.append(f"r_max={r_max}")

            posangle = request.json.get("posangle")
            if not posangle == '': conditions.append(f"posangle={posangle}")

            condStr = " AND ".join(conditions)

            print(condStr)

            try:
                # print(org_url, logo_url)
                cur.execute(f"SELECT * FROM Products WHERE {condStr};")
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            ret = cur.fetchall()
            return jsonify({"status": "found", "payload": ret})

        elif request.json.get('table') == "Radar_users":
            user_login = request.json.get("user_login")
            if not user_login == '': conditions.append(f"user_login='{user_login}'")

            user_password = request.json.get("user_password")
            if not user_password == '': conditions.append(f"user_password='{user_password}'")

            fname = request.json.get("fname")
            if not fname == '': conditions.append(f"fname='{fname}'")
            
            sname = request.json.get("sname")
            if not sname == '': conditions.append(f"sname='{sname}'")

            condStr = " AND ".join(conditions)

            print(condStr)

            try:
                # print(org_url, logo_url)
                cur.execute(f"SELECT * FROM Radar_users WHERE {condStr};")
                # mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"Unknown error ({errorCode})"})
            
            ret = cur.fetchall()
            return jsonify({"status": "found", "payload": ret})

        elif request.json.get('table') == "Radars":
            radar_name = request.json.get("radar_name")
            if not (radar_name is None or radar_name) == '': conditions.append(f"radar_name='{radar_name}'")

            lon = request.json.get("lon")
            if not (lon is None or lon) == '': conditions.append(f"lon={lon}")

            lat = request.json.get("lat")
            if not (lat is None or lat == ''): conditions.append(f"lat={lat}")
            
            elev_asl = request.json.get("elev_asl")
            if not (elev_asl is None or elev_asl) == '': conditions.append(f"elev_asl={elev_asl}")

            is_dp = request.json.get("is_dp")
            if not (is_dp is None or is_dp) == '': conditions.append(f"is_dp={is_dp}")

            is_doppler = request.json.get("is_doppler")
            if not (is_doppler is None or is_doppler) == '': conditions.append(f"is_doppler={is_doppler}")

            net_id = request.json.get("net_id")
            if not (net_id is None or net_id) == '': conditions.append(f"net_id={net_id}")

            condStr = " AND ".join(conditions)

            print(condStr)

            # print(f"(NULL, '{radar_name}', {lon}, {lat}, {elev_asl}, {is_dp}, {is_doppler}, {net_id})")
            try:
                # print(org_url, logo_url)
                cur.execute(f"SELECT * FROM Radars WHERE {condStr};")
                # mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})
            
            ret = cur.fetchall()
            return jsonify({"status": "found", "payload": ret})

        elif request.json.get('table') == "Scales":
            scale_name = request.json.get("scale_name")
            if not (scale_name is None or scale_name == ''): conditions.append(f"scale_name='{scale_name}'")

            vmin = request.json.get("vmin")
            if not (vmin is None or vmin == ''): conditions.append(f"vmin={vmin}")

            vmax = request.json.get("vmax")
            if not (vmax is None or vmax == ''): conditions.append(f"vmax={vmax}")

            condStr = " AND ".join(conditions)

            print(condStr)

            try:
                # print(org_url, logo_url)
                cur.execute(f"SELECT * FROM Scales WHERE {condStr};")
                # mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})
            
            ret = cur.fetchall()
            return jsonify({"status": "found", "payload": ret})

        elif request.json.get('table') == "Scans":
            scan_range = request.json.get("scan_range")
            if not (scan_range is None or scan_range) == '': conditions.append(f"scan_range={scan_range}")

            lowprf = request.json.get("lowprf")
            if not (lowprf is None or lowprf) == '': conditions.append(f"lowprf={lowprf}")

            highprf = request.json.get("highprf")
            if not (highprf is None or highprf) == '': conditions.append(f"highprf={highprf}")

            dbz_on = request.json.get("dbzon")
            if not (dbz_on is None or dbz_on) == '': conditions.append(f"dbz_on={dbz_on}")

            dbuz_on = request.json.get("dbuzon")
            if not (dbuz_on is None or dbuz_on) == '': conditions.append(f"dbuz_on={dbuz_on}")

            v_on = request.json.get("von")
            if not (v_on is None or v_on) == '': conditions.append(f"v_on={v_on}")

            w_on = request.json.get("won")
            if not (w_on is None or w_on) == '': conditions.append(f"w_on={w_on}")

            rhohv_on = request.json.get("rhohvon")
            if not (rhohv_on is None or rhohv_on) == '': conditions.append(f"rhohv_on={rhohv_on}")

            kdp_on = request.json.get("kdpon")
            if not (kdp_on is None or kdp_on) == '': conditions.append(f"kdp_on={kdp_on}")

            phidp_on = request.json.get("phidpon")
            if not (phidp_on is None or phidp_on) == '': conditions.append(f"phidp_on={phidp_on}")

            zdr_on = request.json.get("zdron")
            if not (zdr_on is None or zdr_on) == '': conditions.append(f"zdr_on={zdr_on}")

            rad_id = request.json.get("rad_id")
            if not (rad_id is None or rad_id) == '': conditions.append(f"rad_id={rad_id}")

            condStr = " AND ".join(conditions)

            print(condStr)

            try:
                # print(org_url, logo_url)
                cur.execute(f"SELECT * FROM Scans WHERE {condStr};")
                mysql.connection.commit()
            except(mysql.connection.Error) as error:
                print(error)
                errorCode = error.args[0]
                if errorCode in errorLUT.keys():
                    return jsonify({"status": "ERROR", "details": errorLUT[errorCode]})
                else:
                    return jsonify({"status": "ERROR", "details": f"{error}"})

            ret = cur.fetchall()
            return jsonify({"status": "found", "payload": ret})

    return jsonify({'status': 'OK'})

@app.route('/get_all/<table>')
def getAllData(table):
    cur = mysql.connection.cursor()
    ret = None
    x = None
    try:
        x = cur.execute(f'''SELECT * FROM {table};''')
    except(mysql.connection.Error) as error:
        errorCode = error.args[0]
        if errorCode in errorLUT.keys():
            return errorLUT[errorCode]
        else:
            return f"Unknown error ({errorCode})"
    ret = cur.fetchall()
    print(ret)
    return jsonify(ret)

@app.route('/tables')
def getTablesList():
    cur = mysql.connection.cursor()
    ret = None
    try:
        cur.execute(f'''SHOW TABLES;''')
    except(mysql.connection.Error) as error:
        errorCode = error.args[0]
        if errorCode in errorLUT.keys():
            return errorLUT[errorCode]
        else:
            return f"Unknown error ({errorCode})"
    ret = cur.fetchall()
    return jsonify(ret)

@app.route('/get_fields/<table>')
def getFields(table):
    cur = mysql.connection.cursor()
    ret = None
    try:
        cur.execute(f'''DESCRIBE {table}''')
    except(mysql.connection.Error) as error:
        errorCode = error.args[0]
        if errorCode in errorLUT.keys():
            return errorLUT[errorCode]
        else:
            return f"Unknown error ({errorCode})"
    ret = cur.fetchall()
    return jsonify(ret)

if __name__ == "__main__":
    app.run()