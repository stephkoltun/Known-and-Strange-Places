from os import listdir
from os.path import isfile, join

classname = 'lazy'
mypath = 'img/monday/'
#mypath = 'img/tuesday/'
#mypath = 'img/wednesday/'
#mypath = 'img/thursday/'
#mypath = 'img/friday/'

onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

totalString = ''

for index, filename in enumerate(onlyfiles):
    # a photo every five minutes
    if (index % 5 == 0):
        # create HTML structure
        htmlbase = "<img class='" + classname + "' data-original='" + mypath + filename + "'>\n"
        totalString += htmlbase

f = open('monday.html','w')
#f = open('tuesday.html','w')
#f = open('wednesday.html','w')
#f = open('thursday.html','w')
#f = open('friday.html','w')
f.write(totalString)
f.close()

print ("done")
#print (totalString)
