from os import listdir
from os.path import isfile, join

mypath = 'img/monday/'

onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

totalString = "var imageFiles = ["

for index, filename in enumerate(onlyfiles):
    # a photo every five minutes
    if (index % 1 == 0):
        # create HTML structure
        base = "'" + mypath + filename + "',\n"
        totalString += base

totalString += "]"

f = open('monday.js','w')
#f = open('tuesday.html','w')
#f = open('wednesday.html','w')
#f = open('thursday.html','w')
#f = open('friday.html','w')
f.write(totalString)
f.close()

print ("done")
#print (totalString)
