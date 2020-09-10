import requests
from bs4 import BeautifulSoup
import mechanize
import pandas as pd
import getpass
import keyring




br = mechanize.Browser()
br.open("https://www.gradescope.com/login")
br.select_form(nr=0)

if keyring.get_password("system", "gradescope") and keyring.get_password("system", "gradescope-email") is not None:
    br.form['session[email]'] = keyring.get_password("system", "gradescope-email")
    br.form['session[password]'] = keyring.get_password("system", "gradescope")
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

    file1 = open("grades.txt","w")

    for a in soup.find_all('a', href=True):
        h3 = a.find_all('h3', class_="courseBox--shortname")
        if len(h3) == 1:
            for name in h3:
                clases[str(name.text)] = a["href"]

    print("Grades:")
    print()
    for class_ in clases:
        br.open("https://www.gradescope.com" + clases[class_])
        soup = BeautifulSoup(br.response().read(), features="html5lib")
        score = soup.find_all("div", class_="submissionStatus--score")
        for tr in soup.find_all("tr"):
            grade = tr.find("div", class_="submissionStatus--score")
            if grade is not None:
                assignment = tr.find("a")
                try:
                    grades[class_].update({assignment.text:grade.text})
                except KeyError:
                    grades[class_] = {assignment.text:grade.text}
        file1.write(f"{class_}\n")
        df = pd.DataFrame(grades[class_].items(), columns=["assignment", "score"])
        print(class_)
        print()
        print(df)
        print()
        file1.write(f"{df.to_string()}\n")
        file1.write("\n")
        
    file1.close()


    
