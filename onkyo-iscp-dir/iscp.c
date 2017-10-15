#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include "network.h"
#include "iscp.h"


struct eISCPMsg {
  struct {
    char id[4];        // "ISCP"
    uint32_t headerSize; // Big-Endian header size
    uint32_t dataSize;   // Big-Endian data size
    uint8_t  version;    // 1 
    uint8_t  reserved[3];
  } header;
  struct {
    uint8_t start;       // '!'
    uint8_t dest;        // '1' == Receiver
    char  cmd[3];        // Three character command string 
    char  param[];       // Variable length parameter, terminated with \r\n
  } data;
};

struct iscpHost
{
  char *hostname;
  int port;

  int socket;
};

struct iscpHost *host_p = NULL;

void iscp_free(struct iscpHost *h_p)
{
  if (h_p)
  {
    if (h_p->hostname)
    {
      free(h_p->hostname);
    }

    if (h_p->socket != -1)
    {
      close(h_p->socket);
    }

    free(h_p);
  }
}

void iscpDisconnect()
{
  if (host_p)
  {
    iscp_free(host_p);
    host_p = NULL;
  }
}

int iscpConnect(char *hostname, unsigned short int port)
{
  int result = -1;
  struct iscpHost *connect_p = NULL;

  connect_p = calloc(1, sizeof(*connect_p));

  if (connect_p != NULL)
  {
    if (port > 0)
    {
      connect_p->port = port;
    }
    else
    {
      connect_p->port = ISCP_PORT;
    }

    connect_p->hostname = strdup(hostname);
    if (connect_p->hostname)
    {
      connect_p->socket = networkTCPConnect(connect_p->hostname, 
                                            connect_p->port);
      if (connect_p->socket != -1)
      {
        result = 0;
      }
    }
  }

  if (result != 0)
  {
    iscp_free(connect_p);
  }
  else
  {
    host_p = connect_p;
  }

  return result;
}

int iscpSendCommand(char *cmd, char* param)
{
  int result = 0;
  char *buffer_p = NULL;
  unsigned int bufferSize = 0; 
  struct eISCPMsg *msg_p;
                                                      
  if ((!host_p) ||
      (!cmd) ||
      (!param))
  {
    return -1;
  }
  
  bufferSize = sizeof(*msg_p) + strlen(param) + 2;
  buffer_p = calloc(1, bufferSize);
  
  if (!buffer_p)
  {
    return -2;
  }
  
  msg_p = (struct eISCPMsg *) buffer_p;
  
  memcpy(msg_p->header.id, "ISCP", 4);
  msg_p->header.headerSize = htonl(sizeof(msg_p->header));
  msg_p->header.dataSize = htonl(sizeof(msg_p->data) + 
                                 strlen(param) +
                                 1);
  msg_p->header.version = 1;
  
  msg_p->data.start = (uint8_t) '!';
  msg_p->data.dest = (uint8_t) '1';
  memcpy(msg_p->data.cmd, cmd, sizeof(msg_p->data.cmd));
  sprintf(msg_p->data.param,
          "%s\r\n",
          param);
          
  result = write(host_p->socket,
                 buffer_p,
                 bufferSize); 
                                                  
  free(buffer_p);

  return result;  
}
