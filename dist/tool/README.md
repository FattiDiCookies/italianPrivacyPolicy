# FDC CookieLaw Tool 1.2.1
Plugin jQuery per la gestione delle pagine necessarie agli adempimenti della CookieLaw

* Informativa breve sull'uso dei cookie (banner)
* Gestione del consenso da parte dell'utente
* Blocco preventivo dei cookie
* Informativa estesa sull'uso dei cookie
* Privacy Policy


### Changes

##### version 1.2.1
* Corretto bug apertura banner dopo rifiuto del consenso

##### version 1.2.0
* Introdotta nuova callback *callbackOnNotAccepted*

##### version 1.1.1
* Miglioramenti codice

##### version 1.1.0
* Aggiunta compatibilità con Bootstrap 3.X nel banner e nelle policy
* Aggiunto Bootstrap Accordion per i servizi nell'informativa estesa
* Aggiunto parametro del plugin per attivazione Bootstrap (default: false)

##### version 1.0.0 (0.11.2-beta)
* Modifiche allo stile CSS
* Correzioni codice javascript jquery.fdCookieLaw.js

##### version 0.11.1-alpha
* Corretto bug in jquery.fdCookieLaw.js

##### version 0.11.0-alpha
* Aggiunto pulsante per rimuovere il consenso nell'informativa estesa
* Aggiunta funzione di callback al ritiro del consenso
* Corretto bug in cookie policy (banner)
* Corretto bug in cookie policy (informativa estesa)

##### version 0.10.0-alpha
* Aggiunto pulsante per accettare la policy nell'informativa estesa

##### version 0.9.2-alpha
* Rimosso l'import del font "Lato" dal CSS
* Assegnata famiglia generica sans-serif al banner
* Aggiunti nuovi moduli Grunt
* Modifiche al file Grunt

##### version 0.9.1-alpha
* Aggiunte le versioni minimizzate dei file .css e .js del tool (soltanto in dist)
* Aggiunti nuovi moduli Grunt
* Modifiche al file Grunt

##### version 0.9.0-alpha
* Introdotta una nuova opzione del plugin per funzione callback (la funzione viene lanciata ad accettazione avvenuta della cookie policy).

##### version 0.8.1-alpha
* Corretti degli errori di ortografia sull'informativa breve all'interno dello script
* Tolto il banner da entrambe le pagine Policy e Cookie
* Codice javascript corretto e migliorato con jshint
* Aggiunto controllo che elimina il blocco di esecuzione dello script se docs.complete.json non è consistente

##### version 0.8.0-alpha
* rinominati file css/less
* alcuni aggiornamenti al css
* eliminati html dalla cartella docs
* versione non retrocompatibile

##### version 0.7.3-alpha
* aggiunti servizi alla configurazione

##### version 0.7.2-alpha
* risolto bug scelta file json dei documenti

##### version 0.7.1-alpha
* risolto bug caricamento descrizione servizi

##### version 0.7.0-alpha
* sistema completamente cambiato
* caricamento dei contenuti in formato json
* versione non retrocompatibile

##### version 0.6.1-alpha
* parametro "acceptOnScroll" sovrascrivibile da plugin
* correzioni minori

##### version 0.6.0-alpha
* servizi divisi in categorie
* versione non retrocompatibile con API precedenti.

##### version 0.5.2-alpha
* servizi aggiunti alla configurazione
* correzioni minori

##### version 0.5.1-alpha
* perfezionate informative brevi dinamiche

##### version 0.5.0-alpha
* informative brevi dinamiche e configurabili
* posizioni top e bottom per il banner
* vari bug risolti


