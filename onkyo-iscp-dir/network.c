#include <stdio.h>
#include <string.h>

#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

#include "network.h"

int networkTCPConnect(char *hostname, short unsigned int port)
{
  int sock = -1;

  struct addrinfo hints;
  struct addrinfo *res;
  char service[6];
  
  // lookup hostname + port
  snprintf(service, sizeof(service), "%u", port);
  memset(&hints, 0, sizeof(hints));
  hints.ai_family = AF_INET;
  hints.ai_socktype = SOCK_STREAM;
  
  if ( (getaddrinfo(hostname,
                    service,
                    &hints,
                    &res) == 0) &&
       (res != NULL ) )
  {
    sock = socket(hints.ai_family, hints.ai_socktype, 0);
    if (sock != -1)
    {
      if (connect(sock,
                  res->ai_addr,
                  res->ai_addrlen) == -1)
      {
        close(sock);
        sock = -1;
      }
    }

    freeaddrinfo(res);
  }
  
  return sock;
}
