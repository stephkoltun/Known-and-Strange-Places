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

print ("libraries imported")

images, pca_features = pickle.load(open('data/features_blocks.p', 'rb'))

for i, f in list(zip(images, pca_features))[0:5]:
    print("image: %s, features: %0.2f,%0.2f,%0.2f,%0.2f... "%(i, f[0], f[1], f[2], f[3]))

# get a random selection of images from the data set
num_images_to_plot = 2744
# if len(images) > num_images_to_plot:
#     sort_order = sorted(random.sample(range(len(images)), num_images_to_plot))
#     images = [images[i] for i in sort_order]
#     pca_features = [pca_features[i] for i in sort_order]

# run t-SNE on the feature vectors
X = np.array(pca_features)
tsne = TSNE(n_components=2, learning_rate=150, perplexity=30, angle=0.2, verbose=2).fit_transform(X)

# normalize the embedding so that the 2d points lie entirely in the range (0,1)
tx, ty = tsne[:,0], tsne[:,1]
tx = (tx-np.min(tx)) / (np.max(tx) - np.min(tx))
ty = (ty-np.min(ty)) / (np.max(ty) - np.min(ty))

width = 4000
height = 3000
max_dim = 100

full_image = Image.new('RGBA', (width, height))
for img, x, y in tqdm(zip(images, tx, ty)):
    tile = Image.open(img)
    rs = max(1, tile.width/max_dim, tile.height/max_dim)
    tile = tile.resize((int(tile.width/rs), int(tile.height/rs)), Image.ANTIALIAS)
    full_image.paste(tile, (int((width-max_dim)*x), int((height-max_dim)*y)), mask=tile.convert('RGBA'))

matplotlib.pyplot.figure(figsize = (16,12))
imshow(full_image)

full_image.save("data/tSNE-blocks-2.png")
print("save image")
