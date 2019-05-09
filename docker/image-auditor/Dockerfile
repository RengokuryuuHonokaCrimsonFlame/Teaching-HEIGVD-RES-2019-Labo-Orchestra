FROM node:8
MAINTAINER Julien Rod <julien.rod@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY . /opt/app/

CMD ["node", "/opt/app/Auditor.js"]