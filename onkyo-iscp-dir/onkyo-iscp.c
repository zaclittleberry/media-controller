#include <stdio.h>

#include "iscp.h"

void usage()
{
  printf("Usage:\n"
         "  onkyo-iscp <amp hostname or IP address> <ISCP command> <command parameter>\n"
         "Example:\n"
         "  onkyo-iscp 192.168.1.100 PWR 01\n"
         "\n");
}

int main(int argc, char **argv)
{
  int result = 0;
  char *hostname, *cmd, *param;
  unsigned short int port = ISCP_PORT;

  if (argc != 4)
  {
    usage();
    return 1;
  }
  else
  {
    hostname = argv[1];
    cmd = argv[2];
    param = argv[3];
  }

  result = iscpConnect(hostname, port);
  if (result == 0)
  {
    result = iscpSendCommand(cmd, param);
    if (result >= 0)
    {
      fprintf(stdout, "OK: %s %s\n", cmd, param);
    }
    else
    {
      fprintf(stderr, "Error: unable to send command %s %s\n", cmd, param);
    }

    iscpDisconnect();
  }
  else
  {
    fprintf(stderr, "Error: cannot connect to %s:%u\n", hostname, port);
  }

  return result;
}
