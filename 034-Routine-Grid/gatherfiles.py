from os import listdir
from os.path import isfile, join

classname = 'lazy'
mypath = 'img/'
#mypath = 'img/tuesday/'
#mypath = 'img/wednesday/'
#mypath = 'img/thursday/'
#mypath = 'img/friday/'

onlyfiles = sorted([f for f in listdir(mypath) if isfile(join(mypath, f))])

totalString = ''

for index, filename in enumerate(onlyfiles):
    # create HTML structure
    htmlbase = "<img class='" + classname + "' src='" + mypath + filename + "'>\n"
    totalString += htmlbase

f = open('allDays.html','w')
#f = open('monday.html','w')
#f = open('tuesday.html','w')
#f = open('wednesday.html','w')
#f = open('thursday.html','w')
#f = open('friday.html','w')
f.write(totalString)
f.close()

print ("done")
#print (totalString)
