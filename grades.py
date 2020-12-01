import requests
from bs4 import BeautifulSoup
import mechanize
import pandas as pd
import getpass
import keyring
import os
import subprocess
import webbrowser
from datetime import date
import datetime
now = datetime.datetime.now()

class bcolors:
    HEADER = '\033[44m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

br = mechanize.Browser()
br.open("https://www.gradescope.com/login")
br.select_form(nr=0)

email = keyring.get_password("system", "gradescope-email")
pswd = keyring.get_password("system", "gradescope")

if email and pswd is not None:
    
    print(f"Logging in with: {email}")
    print("")
    br.form['session[email]'] = email
    br.form['session[password]'] = pswd
else:
    print("Please enter your Gradescope email and password to continue:")
    print()
    email = input("Email: ")
    password = getpass.getpass("Password: ")
    save = input("Save email and password? y/n: ")
    if save == "y" or save == "Y":
        keyring.set_password("system", "gradescope-email", email)
        keyring.set_password("system", "gradescope", password)
    else:
        pass
    br.form['session[email]'] = keyring.get_password("system", "gradescope-email")
    br.form['session[password]'] = keyring.get_password("system", "gradescope")

 
req = br.submit()
soup = BeautifulSoup(br.response().read(), features="html5lib")
error = soup.find("div", class_="alert alert-flashMessage alert-error")



if error is not None:
    print("Invalid email/password combination. Please try again")
    keyring.delete_password("system", "gradescope")
    keyring.delete_password("system", "gradescope-email")
else:    
    names = soup.find_all("h3", class_="courseBox--shortname")
    clases = dict()
    grades = {}
    missingAssignments = []
    data = []
    dataAssignments = []
    testAssignments = []
    file1 = open("report.txt","w")
    jsFile = open("data.js","w")

    for a in soup.find_all('a', href=True):
        h3 = a.find_all('h3', class_="courseBox--shortname")
        if len(h3) == 1:
            for name in h3:
                clases[str(name.text)] = a["href"]

    file1.write(f"Grade report {str(date.today())}")
    file1.write("\n")
    for class_ in clases:
        dataAssignments = []
        testAssignments = []
        br.open("https://www.gradescope.com" + clases[class_])
        soup = BeautifulSoup(br.response().read(), features="html5lib")
        score = soup.find_all("div", class_="submissionStatus--score")
        average = 0
        num = 0
        missingAssignments = []
        for tr in soup.find_all("tr"):
            grade = tr.find("div", class_="submissionStatus--score")
            work = tr.find("div", class_="submissionStatus--text")
            date = tr.find('span', class_="submissionTimeChart--dueDate")
            if work is not None:
                if work.text == "No Submission":
                    a = tr.find("a")
                    missingAssignments.append(a.text)
                    testAssignments.append({a.text:date.text[:6]+" "+str(now.year)})
            if grade is not None:
                assignment = tr.find("a")
                dataAssignments.append(assignment.text + " - " + grade.text)
                #testAssignments.append({assignment.text:date.text[:6]+" "+str(now.year)})
                try:
                    grades[class_].update({assignment.text:grade.text})
                except KeyError:
                    grades[class_] = {assignment.text:grade.text}
                numero = ""
                segundo_numero = ""
                primer_numero = ""
                for i in grade.text.replace(".",""):
                    try:
                        int(i)
                        segundo_numero = segundo_numero + i
                    except ValueError:
                        numero = segundo_numero
                        if numero != "":
                            primer_numero = segundo_numero
                        segundo_numero = ""
                scores = int(primer_numero) / int(segundo_numero)*100
                average += scores
                num += 1
        missingAssignmentsLine = bcolors.FAIL + "  - " +  '\n  - '.join(missingAssignments) + bcolors.ENDC
        classLine =  bcolors.HEADER  + "     " + class_ + "     " + bcolors.ENDC  + "\n"
        
        
        try:
            df = pd.DataFrame(grades[class_].items(), columns=["assignment", "score"])
            classGrade = int(average/num)
            #file1.write("\n")
            #file1.write(f"{class_}\nGrade: {classGrade}")
            #file1.write("\n")
            #print(f"{classLine}\nGrade: {bcolors.OKGREEN}{bcolors.BOLD}{classGrade}{bcolors.ENDC}")
            #print()
            if len(missingAssignments) > 0:
                pass
                 #print(f"Missing assignments: \n{missingAssignmentsLine}")
                 #print("")
                 #file1.write(f"Missing assignments: {'· '.join(missingAssignments)}")
            #print(df)
            #print()        
            #file1.write(f"{df.to_string()}\n")
            #file1.write("\n")
            data.append(
            {
                "class":class_,
                "assignments": dataAssignments,
                "missing": missingAssignments,
                "grade": classGrade,
                "dates":testAssignments,
                "link": "https://www.gradescope.com" + clases[class_],
            }
        )
        except KeyError:
            #file1.write("\n")
            #file1.write(f"{class_}\nNothing graded yet...")
            #file1.write("\n")
            #file1.write(f"Missing assignments: {'· '.join(missingAssignments)}")
            #file1.write("\n")
            #print(f"{classLine}")
            #print(f"Missing assignments: \n{missingAssignmentsLine}")
            #print("")
            #print(f"Nothing graded yet...") 
            #print()
            #file1.write("\n")
            data.append(
            {
                "class":class_,
                "assignments": dataAssignments,
                "missing": missingAssignments,
                "grade": 0,
                "dates":[],
                "link": "https://www.gradescope.com" + clases[class_],
            }
        )

        #print()
        #print()
        #print()
    jsFile.write(f"const data = {data}")
    jsFile.write("\n" )
    jsFile.write("export default data;")
    jsFile.close()
        
    file1.close()
    #subprocess.Popen(['python', '-m', 'http.server', '8000'])
    #webbrowser.open_new_tab('google.com')
