import pandas as pd
import json

with open("Chars.txt", "r", encoding="utf-8") as f:
    data = f.read().rsplit("\n")
    chars = {}
    for i in data:
        chars[i[0]] = i[1]



def toGreek(s):
    st = ""
    keys = chars.keys()
    for i in s:
        if i.lower() in keys:
            st += chars[i.lower()].upper()
        else:
            st += i.upper()
    return st


#data = pd.read_excel("spreadsheet.xlsx")

with open("Classes.json", "r") as f:
    classes = json.load(f)

with open("SelectClass.json", "r") as f:
    sc = json.load(f)

with open("Teachers.json", "r") as f:
    teachers = json.load(f)

with open("Timetable.json", "r") as f:
    timetable = json.load(f)

dic = {"teachers": teachers, "classes": sc, "timetable": timetable}
with open("data.json", "w") as f:
    json.dump(dic, f)


