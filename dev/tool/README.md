# FDC CookieLaw Tool 1.8.1
Plugin jQuery per la gestione delle pagine necessarie agli adempimenti della CookieLaw

* Informativa breve sull'uso dei cookie (banner)
* Gestione del consenso da parte dell'utente
* Accettazione selettiva dei cookie
* Blocco preventivo dei cookie
* Informativa estesa sull'uso dei cookie
* Privacy Policy

### Changes

##### version 1.8.1
* Bugfixing

##### version 1.8.0
* JS refactoring

##### version 1.7.0
* Introdotta la possibilità di personalizzare i testi dei pulsanti del banner attraverso il file di configurazione o dagli appositi parametri del plugin.

##### version 1.6.0
* Introdotti cambiamenti per conformità ultime linee guida 10 Gennaio 2022
* Piccoli cambiamenti CSS

##### version 1.5.0-beta
* Aggiornamento delle funzionalità per introduzione dei testi per i servizi in cui avviene la raccolta dati, inseriti nei testi dinamici della privacy policy<br>
(questo update rende necessario un aggiornamento del file di configurazione. 
Per tutte le installazioni precedenti è possibile effettuare comunque l'aggiornamento anche senza update 
del file di configurazione. In questo caso saranno utilizzati dei valori di default. Questa possibilità verrà rimossa dalla versione 1.6.0 del plugin)

##### version 1.4.6
* Bug fixing
* La compilazione ufficiale del css attraverso Grunt avviene ora tramile i file SASS
* Introdotto POSTCSS per la gestione dei prefissi delle regole CSS e per la minificazione dei file
* Rimosso CssMin dal file Grunt
* I file less verranno rimossi dalla prossima versione

##### version 1.4.5
* Aggiornamento del file json di configurazione in seguito all'aggiornamento della Privacy Policy
* Aggiornamento del file js in seguito all'aggiornamento della Privacy Policy
* Aggiunto file SASS per lo stile. La compilazione ufficiale del css attraverso Grunt avviene ancora tramile i file LESS
* Aggiunta proprieta *z-index: 10000* alla classe *.fdc-cookielaw__banner*

##### version 1.4.1
* Aggiunto il servizio *facebook pixel* nel json di configurazione a seguito dell'implementazione del servizio 
nei testi della policy.

##### version 1.4.0
* Aggiunto singolo cookie per ogni servizio caricato nella policy.

##### version 1.3.4-beta
* Introduzione di un metodo pubblico .searchService() per il controllo della scelta dell'utente riguardo ogni soingolo servizio.

##### version 1.3.3-beta
* Sostanziale aggiornamento nella gestione della privacy policy (questo update rende necessario un aggiornamento del file di configurazione. 
Per tutte le installazioni precedenti è possibile effettuare comunque l'aggiornamento anche senza update 
del file di configurazione. In questo caso saranno utilizzati dei valori di default. Questa possibilità verrà rimossa dalla versione 1.5.0 del plugin)

*Per l'elenco delle modifiche incluse in questo aggiornamento vedasi la relativa pagina nel wiki di documentazione.*

##### version 1.3.2-beta
* Itrodotto markup bootstrap per i pannelli di scelta dei singoli servizi nella cookie policy
* Aggiustamenti CSS

##### version 1.3.1-beta
* Introdotta possibilità di personalizzazione del valore dei cookie di accettazione e rifiuto della policy, nonché dei singoli servizi<br>
(questo update rende necessario un aggiornamento del file di configurazione. 
Per tutte le installazioni precedenti è possibile effettuare comunque l'aggiornamento anche senza update 
del file di configurazione. In questo caso saranno utilizzati dei valori di default. Questa possibilità verrà rimossa dalla versione 1.5.0 del plugin)

##### version 1.3.0-beta
* Introdotta gestione del consenso per singoli servizi

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


