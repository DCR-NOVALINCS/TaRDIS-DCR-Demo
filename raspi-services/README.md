## Raspberry Pi Services

For demonstration purposes, the TaRDIS DCR toolbox currently has a companion
setup to showcase the Energy Communities (EDP use case) with 
[Raspberry Pis](https://codelab.fct.unl.pt/di/research/tardis/wp3/tardis-dcr-button-pi) 
enacting *Prosumers* and *Community Orchestrators*.

The files in this folder facilitate the process of installing the 
use case in a Raspberry Pi. The scripts do not require `sudo` permissions.

---

### Installing the Services

The script `install.sh` defines and installs two user services that transparently deploy 
the use case on a Raspberry Pi:
 - tardis-demo-babel.service
 - tardis-demo-gpio.service

To this end, each device is assumed to be pre-configured 
with its role. This configuration is conveyed by a simple properties-like file, 
which the script expects to find under 
`~/.config/tardis-demo/participant.cfg`.

> For instance, the `participant.cfg` file for a device enacting 
> `Prosumer(id=1, cid=2)` would be:
> ```
> role=P
> id=1
> cid=2
> ```

Ensure `install.sh` is executable:
```console
chmod +x ./install.sh
```
Usage:
```console
./install.sh
```

The services become immediately available after `install.sh` runs and are
restarted on reboot.

----

### Manually Stopping/Restarting Installed Services 

Stopping a service:
```console
systemctl --user stop <service-name>
```

Starting a service:
```console
systemctl --user start <service-name>
```

----

### Uninstalling the Services

The script `uninstall.sh` stops, disables and removes the services previously
installed.

Ensure `uninstall.sh` is executable:
```console
chmod +x ./uninstall.sh
```
Usage:
```console
./uninstall.sh
```
After `uninstall.sh` runs, the services will have been removed and no longer
restart on reboot.