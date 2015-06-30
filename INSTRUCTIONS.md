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

### test in locale
se cerchi di testare il funzionamento del codice in locale facendo cose del genere 
> firefox  italianPrivacyPolicy/fdc-tool/demo.html

potresti avere [problemi a far funzionare il plugin jquery]
(https://github.com/FattiDiCookies/italianPrivacyPolicy/issues/41)
questo dipende dalle impostazioni di sicurezza del browser; per rimediare hai tre possibilità:

1. caricare il tutto su un server web

2. lanciare un server locale per lo sviluppo (istruzioni per linux)
dentro la cartella  
> italianPrivacyPolicy/fdc-tool

esegui uno di questi due comandi:
> python -m SimpleHTTPServer

oppure

>php -S localhost:8000

apri questa url http://127.0.0.1:8000/demo.html e vedrai la pagina funzionare correttamente

oppure 

aprire il file demo.html con l'editor brackets e utilizzare la funzione [live preview] (https://github.com/adobe/brackets/wiki/How-to-Use-Brackets#live-preview)

### Attenzione
Prima di iniziare a modificare leggi il [wiki del progetto] (https://github.com/FattiDiCookies/italianPrivacyPolicy/wiki)
Per il momento tutti i commit avvengono sul master, questo almeno fino a che il progetto non sarà abbastanza stabile, per permettere a tutti di contribuire in maniera efficiente, consulta spesso le [issue] (https://github.com/FattiDiCookies/italianPrivacyPolicy/issues) e tieni il tuo repository locale il più possibile sincronizzato con quello remoto.


Grazie e buon lavoro!
