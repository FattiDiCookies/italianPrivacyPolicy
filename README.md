# italianPrivacyPolicy v0.15.0-alpha
Questo repository contiene un'informativa sulla privacy, il trattamento dei dati personali e l'uso dei cookies secondo le vigenti norme di legge.

### Il progetto
Questo progetto nasce con l'idea di creare un testo a norma di legge che sia modulare (con parti indipendenti redatte per ogni diversa esigenza) da far includere agli sviluppatori nelle proprie pagine web.

## COME FUNZIONA
Il repository contiene una directory **dist** all'interno della quale sono contenuti i testi legali (directory **dist/docs/**) e il tool di implementazione automatica delle policy e del banner relativo all'uso dei cookie (directory **dist/tool/**).

### Testi
[La directory dei testi](https://github.com/FattiDiCookies/italianPrivacyPolicy/tree/master/dist/docs) delle policy contiene due sub-directory (**cookie-policy** e **privacy-policy**) a loro volta contenenti tutti i relativi documenti esportati nei formati *html* e *json*.<br>
Al momento l'esportazione in json è eseguita raccogliendo tutti i documenti in un unico file.

### Tool
[Il tool di implementazione](https://github.com/FattiDiCookies/italianPrivacyPolicy/tree/master/dist/tool) **FDC CookieLaw Tool** è un plugin jQuery in grado di gestire i testi delle policy (cookie e privacy), il banner di informativa breve sull'uso dei cookie e il relativo consenso degli utenti.<br>
Tutti i testi legali sono già inclusi (in formato json) nel tool.

### Versioni 

Le versioni del progetto **italianPrivacyPolicy** sono numerate con numero incrementale, aggiornato ogni volta che i testi legali e/o il tool vengono aggiornati.

Le versioni dei testi legali e del tool sono anch'esse numerate con un numero di versione indipendente.

## Attenzione!!!
Questo progetto è ancora in fase alpha, quindi consigliamo di non integrare ancora nei vostri siti i testi presenti nel repository.

## COME CONTRIBUIRE
Questo gruppo di sviluppo è aperto a chiunque sia intenzionato a dare il suo contributo.<br>
Se vuoi farne parte, fai una richiesta in [questo ticket](https://github.com/FattiDiCookies/italianPrivacyPolicy/issues/1) e ti aggiungeremo al team. 


##NOTA 
Questi materiali, testi, link e software, vanno considerati come modelli in divenire e sono stati realizzati con il contributo spontaneo dei vari autori che hanno partecipato. Non e' una consulenza legale e ognuno dovra' adattarli e valutare autonomamente come correggerli, condividendo le proprie valutazioni per migliorarli. Si raccomanda di partecipare solo con contenuti originali perche' anche le istruzioni a testi di legge con contributo creativo sono soggette a diritto d'autore e possono essere usate solo specificando per finalita' di studio, ma non nei materiali finali.
