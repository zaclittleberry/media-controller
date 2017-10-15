#ifndef _ISCP_H
#define _ISCP_H

#define ISCP_PORT 60128

int iscpConnect(char *hostname, unsigned short int port);
void iscpDisconnect();

int iscpSendCommand(char *cmd, char* param);

#endif
