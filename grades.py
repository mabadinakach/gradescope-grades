import requests
from bs4 import BeautifulSoup
import mechanize
import pandas as pd

print("Please enter your Gradescope email and password to continue:")
print()

br = mechanize.Browser()
br.open("https://www.gradescope.com/login")
br.select_form(nr=0)
br.form['session[email]'] = input("Email: ") # Change this to your actual email so it remembers it.
br.form['session[password]'] = input("Password: ") # Change this to your password so it remembers it.
req = br.submit()
soup = BeautifulSoup(br.response().read(), features="html5lib")
error = soup.find("div", class_="alert alert-flashMessage alert-error")

if error is not None:
    print("Invalid email/password combination. Please try again")
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


    
