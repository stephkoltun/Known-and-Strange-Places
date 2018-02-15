from os import listdir
from os.path import isfile, join

mypath = 'img/'
onlyfiles = [f for f in sorted(listdir(mypath)) if isfile(join(mypath, f))]

totalString = 'var imgArray = [\n'

for index, filename in enumerate(onlyfiles):
    # create JSON structure
    obj = "{\n\tpath: '" + mypath + filename +"',\n\tloaded: null,\n},\n"
    totalString += obj

totalString += "];"

f = open('images.js','w')
#f = open('tuesday.html','w')
#f = open('wednesday.html','w')
#f = open('thursday.html','w')
#f = open('friday.html','w')
f.write(totalString)
f.close()

print ("done")
#print (totalString)
