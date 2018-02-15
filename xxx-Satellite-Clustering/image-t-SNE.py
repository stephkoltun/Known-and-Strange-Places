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
import datetime

print ("libraries imported")
now = datetime.datetime.now()

images, pca_features = pickle.load(open('data/features_blocks_solid.p', 'rb'))
transparentimages, ignorepca_features = pickle.load(open('data/features_blocks_trans.p', 'rb'))

for i, f in list(zip(images, pca_features))[0:5]:
    print("image: %s, features: %0.2f,%0.2f,%0.2f,%0.2f... "%(i, f[0], f[1], f[2], f[3]))

# get a random selection of images from the data set
# num_images_to_plot = 2744
# if len(images) > num_images_to_plot:
#     sort_order = sorted(random.sample(range(len(images)), num_images_to_plot))
#     images = [images[i] for i in sort_order]
#     pca_features = [pca_features[i] for i in sort_order]

# run t-SNE on the feature vectors
X = np.array(pca_features)
perp = 40
tsne = TSNE(n_components=2, learning_rate=150, perplexity=perp, angle=0.2, verbose=2).fit_transform(X)
#n_components is the number of dimensions to project down to. In principle it can be anything, but in practice t-SNE is almost always used to project to 2 or 3 dimensions for visualization purposes.
#learning_rate is the step size for iterations. You usually won't need to adjust this much, but your results may vary slightly.
#perplexity refers to the number of independent clusters or zones t-SNE will attempt to fit points around. Again, it is relatively robust to large changes, and usually 20-50 works best.
#angle controls the speed vs accuracy tradeoff. Lower angle means better accuracy but slower, although in practice, there is usually little improvement below a certain threshold.

# normalize the embedding so that the 2d points lie entirely in the range (0,1)
tx, ty = tsne[:,0], tsne[:,1]
tx = (tx-np.min(tx)) / (np.max(tx) - np.min(tx))
ty = (ty-np.min(ty)) / (np.max(ty) - np.min(ty))

width = 4000
height = 3000
max_dim = 100

full_image = Image.new('RGBA', (width, height))
for img, x, y in tqdm(zip(transparentimages, tx, ty)):
    tile = Image.open(img)
    rs = max(1, tile.width/max_dim, tile.height/max_dim)
    tile = tile.resize((int(tile.width/rs), int(tile.height/rs)), Image.ANTIALIAS)
    full_image.paste(tile, (int((width-max_dim)*x), int((height-max_dim)*y)), mask=tile.convert('RGBA'))

matplotlib.pyplot.figure(figsize = (16,12))
#imshow(full_image)

# SAVE IMAGE
filename = "data/" + now.strftime("%Y-%m-%d_%H%M%S") + "tSNE-blocks-trans-" + str(perp) + ".png"
full_image.save(filename)
print("saved image")

# # SAVE JSON
# tsne_path = "data/"  + now.strftime("%Y-%m-%d_%H%M%S") + "tSNE-blocks-trans-" + str(perp) + ".json"
#
# data = [{"path":os.path.abspath(img), "point":[x, y]} for img, x, y in zip(transparentimages, tx, ty)]
# with open(tsne_path, 'w') as outfile:
#     json.dumps(data, outfile)
#
# print("saved json")
#
# import rasterfairy
# # nx * ny = 1000, the number of images
# # nx = 52
# # ny = 52
#
# # assign to grid
# grid_assignment = rasterfairy.transformPointCloud2D(tsne)
#
# tile_width = 500
# tile_height = 500
#
# full_width = tile_width
# full_height = tile_height
# aspect_ratio = float(tile_width) / tile_height
#
# grid_image = Image.new('RGB', (full_width, full_height))
#
# for img, grid_pos in tqdm(zip(images, grid_assignment)):
#     idx_x, idx_y = grid_pos
#     x, y = tile_width * idx_x, tile_height * idx_y
#     tile = Image.open(img)
#     tile_ar = float(tile.width) / tile.height  # center-crop the tile to match aspect_ratio
#     if (tile_ar > aspect_ratio):
#         margin = 0.5 * (tile.width - aspect_ratio * tile.height)
#         tile = tile.crop((margin, 0, margin + aspect_ratio * tile.height, tile.height))
#     else:
#         margin = 0.5 * (tile.height - float(tile.width) / aspect_ratio)
#         tile = tile.crop((0, margin, tile.width, margin + float(tile.width) / aspect_ratio))
#     tile = tile.resize((tile_width, tile_height), Image.ANTIALIAS)
#     grid_image.paste(tile, (int(x), int(y)))
#
# matplotlib.pyplot.figure(figsize = (16,16))
# imshow(grid_image)
#
# grid_image.save("data/grid.jpg")
