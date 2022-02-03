FROM postgres:14-alpine

# Default to UTF-8 file.encoding
ENV LANG C.UTF-8

ENV DATA_ZIP TieliikenneAvoinData_5_15.zip
ENV DATA_EXTRACTED "TieliikenneAvoinData_5_15.csv"
ENV KOODISTO_CSV "ajoneuvotiedot_luokitukset.csv"

WORKDIR /tmp

# Install common tools
RUN set -x \
    && apk update && apk upgrade \
    && apk add --no-cache --update \
    bash \
    unzip
    #gawk \
    #sed
    #python \
    #py-pip \
    #py2-psycopg2

ADD data/${DATA_ZIP} /tmp
ADD data/${KOODISTO_CSV} /tmp/koodisto.csv

RUN unzip ${DATA_ZIP} \
    && mv "${DATA_EXTRACTED}" data.csv \
    && rm -rf ${DATA_ZIP}

# RUN mv "${DATA_EXTRACTED}" data.csv

ADD sql/* /tmp/

COPY scripts/init-db.sh /docker-entrypoint-initdb.d/
