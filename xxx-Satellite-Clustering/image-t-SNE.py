import os
import random
import numpy as np
import json
import matplotlib.pyplot
import _pickle as pickle
from matplotlib.pyplot import imshow
from PIL import Image
from sklearn.manifold import TSNE
from tqdm import tqdm

print ("everything imported")

fileimport = open('data/features_caltech101.p', 'rb')
print(fileimport)
images = pickle.load(fileimport)
# for line in fileimport:
#     print (line)

# images, pca_features = pickle.load(open('data/features_caltech101.p', 'r'))

# for i, f in zip(images, pca_features)[0:5]:
#     print("image: %s, features: %0.2f,%0.2f,%0.2f,%0.2f... "%(i, f[0], f[1], f[2], f[3]))
