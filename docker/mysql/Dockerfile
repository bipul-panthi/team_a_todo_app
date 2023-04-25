FROM mysql:8.0-debian

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y locales \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN dpkg-reconfigure locales && \
	locale-gen C.UTF-8 && \
	/usr/sbin/update-locale LANG=C.UTF-8

COPY ./mysql.cnf /etc/mysql/conf.d/mysql.cnf

ENV LC_ALL C.UTF-8