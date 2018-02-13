# all of this is based on: https://github.com/ml4a/ml4a-guides/blob/master/notebooks/image-search.ipynb

# make sure the SSL cert script was run when install Python 3

# had to install tensorflow and h5py via pip
# why does this work even tho the keras model wasn't trained on images of block shapes?
# because it produces a 'unique' feature vector
# and since we're not using it for classification...


import os
import random
import pickle as pickle
import numpy as np
import matplotlib.pyplot
from matplotlib.pyplot import imshow
import keras
from keras.preprocessing import image
from keras.applications.imagenet_utils import decode_predictions, preprocess_input
from keras.models import Model
from sklearn.decomposition import PCA
from scipy.spatial import distance
from tqdm import tqdm

model = keras.applications.VGG16(weights='imagenet', include_top=True)
#model.summary() #print our a summary of the model

# get_image will return a handle to the image itself, and a numpy array of its pixels to input the network
def get_image(path):
    img = image.load_img(path, target_size=model.input_shape[1:3])
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return img, x

# img, x = get_image("assets/banana.jpg")
# predictions = model.predict(x)
# imshow(img)
# for pred in decode_predictions(predictions)[0]:
#     print("predicted %s with probability %0.3f" % (pred[1], pred[2]))

feat_extractor = Model(inputs=model.input, outputs=model.get_layer("fc2").output)
feat_extractor.summary()

# img, x = get_image("assets/banana.jpg")
# feat = feat_extractor.predict(x)
# matplotlib.pyplot.figure(figsize=(16,4))
# matplotlib.pyplot.plot(feat[0])
# matplotlib.pyplot.show()

# get a bunch of images to train on
images_path = 'data/BW'
transpa_path = 'data/blocks'
max_num_images = 2744

images = [os.path.join(dp, f) for dp, dn, filenames in os.walk(images_path) for f in filenames if os.path.splitext(f)[1].lower() in ['.jpg','.png','.jpeg']]
# if max_num_images < len(images):
#     images = [images[i] for i in sorted(random.sample(range(len(images)), max_num_images))]

transparentImages = [os.path.join(dp, f) for dp, dn, filenames in os.walk(transpa_path) for f in filenames if os.path.splitext(f)[1].lower() in ['.jpg','.png','.jpeg']]

print("keeping %d images to analyze" % len(images))

# iterate through and extract the features from all the images
features = []
for image_path in tqdm(images):
    img, x = get_image(image_path);
    feat = feat_extractor.predict(x)[0]
    features.append(feat)

# apply principal component analysis to reduce the dimensionality of the feature vectors
# keep the first 300 principal components
features = np.array(features)
pca = PCA(n_components=300)
pca.fit(features)
pca_features = pca.transform(features)

pickle.dump([transparentImages, pca_features], open('data/features_blocks.p', 'wb'))
