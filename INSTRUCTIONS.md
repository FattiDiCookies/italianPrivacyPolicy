# italianPrivacyPolicy 
## istruzioni per gli sviluppatori

### Prerequisiti
sul tuo sistema devono essere presenti 
* [nodejs] (https://nodejs.org/)
* [grunt] (http://gruntjs.com/)
* git

Per sapere come installarli e configurarli fai riferimento ai siti dei progetti o alle istruzioni del tuo sistema operativo.

### Setup

1. Clona il repository git
> git clone git@github.com:FattiDiCookies/italianPrivacyPolicy.git

2. entra nella directory
> cd italianPrivacyPolicy

3. installa i moduli grunt necessari 
> npm install

4. ora prova a modificare uno dei file presenti nella cartella docs/cookie-policy/md/services/

5. esegui grunt (a causa di un bug devi usare il flag --force)
> grunt --force 

6. il file corrispondente nella cartella docs/cookie-policy/html/services/ è cambiato in modo da rispecchiare le tue modifiche 

### Attenzione
Prima di iniziare a modificare leggi il [wiki del progetto] (https://github.com/FattiDiCookies/italianPrivacyPolicy/wiki)
Per il momento tutti i commit avvengono sul master, questo almeno fino a che il progetto non sarà abbastanza stabile, per permettere a tutti di contribuire in maniera efficiente, consulta spesso le [issue] (https://github.com/FattiDiCookies/italianPrivacyPolicy/issues) e tieni il tuo repository locale il più possibile sincronizzato con quello remoto.

Grazie e buon lavoro!
