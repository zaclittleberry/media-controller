CC=gcc
#CFLAGS=-g

all: onkyo-iscp

onkyo-iscp: onkyo-iscp.c network.o iscp.o

iscp.o: iscp.c iscp.h network.o

network.o: network.c network.h

clean:
	rm -f *.o
	rm -f onkyo-iscp

