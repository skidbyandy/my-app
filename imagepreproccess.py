from keras.preprocessing.image import load_img, img_to_array
import os, glob
import numpy as np
from PIL import Image, ImageOps
import random
##addrandom comment
os.chdir("E:\\ImgCarSma2fold")
print(os.getcwd())
def ldfrmfiles(path, sizer=(64,64)):
    ##os.chdir(path)
    files=glob.glob("*.jpg")
    random.shuffle(files)
    data=list()
    key=list()
    for k in  files:
        if k[:3]=="CRC" or k[:3]=="CAR":
            key.append(np.array([1,0,0]))
        elif k[:3]=="LUN":
            key.append(np.array([0,1,0]))
        else:
            key.append(np.array([0,0,1]))
            key.append(np.array([0,0,1]))
        #print(type(load_img(k,color_mode='grayscale')))
        oimg=load_img(k,color_mode='grayscale')
        if sizer!=False:
            img=oimg.resize(sizer)
        append=img_to_array(img)
        for i in append:
            for j in i:
                j[0]=j[0]/255
        if k[:3]!="CRC" and k[:3]!="CAR" and k[:3]!="LUN":
            append2=np.rot90(append, k=1,axes=(1,0))
            data.append(append2)
        data.append(append)
    data=np.array(data)
    key=np.array(key)
    os.chdir("C:\\users\\skid2\\desktop")
    return data, key
dat, key= ldfrmfiles("E:\\ImgCarSma2fold")
np.save("dat", dat)
np.save("key", key)
'''
traindata , trainkey=ldfrmfiles("set3")
set1dat, set1key=ldfrmfiles("set1")
set2dat, set2key=ldfrmfiles("set2")
set3dat, set3key=ldfrmfiles("set3")
set4dat, set4key=ldfrmfiles("set4")
for i,j in zip(["set1dat","set1key","set2key","set2dat", "set3dat", "set3key", "set4dat", "set4key"],[set1dat,set1key,set2key,set2dat, set3dat, set3key, set4dat, set4key]):
    np.save(i,j)
model.fit(set1dat, set1key, epochs=50, validation_data=(set2dat,set2key))
'''
