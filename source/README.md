# Ilmastosuunnitelman toimenpiteiden päivitys

Kokeiluversio 0.8, 9.11.2026. Yhteinen toimenpidepankki ja valmistelun tuki kunnille. Demo on tarkoitettu kokeiltavaksi ennen julkaisua; tätä versiota ei ole julkaistu GitHubiin.

## Käyttö

Avaa paketin `index.html` selaimessa. Tiedot, kuvat, fontti ja ohjelmakoodi ovat mukana tiedostossa. Verkkoyhteyttä tai tunnuksia ei tarvita.

1. Seulo 239 yleistä toimenpidettä hakusanalla, teemalla tai tavoitellulla vaikutuksella. Avaa toimi listasta tai vetovalikosta.
2. Avaa valmis kuvaus muokattavaksi. Valitse rajattu kokeilu, kunnan yhteinen toteutus tai toiminnan laajentaminen.
3. Täsmennä seitsemän kenttää: **Toimenpiteen nimi, Toimenpiteen kuvaus, Vastuuhenkilö, Aikataulu, Kustannusarvio, Seuranta sekä Vaikutukset ja perustelut**.
4. Lisää toimi suunnitelmaan. Lataa Suunnitelma-näkymästä Word (.docx), Excel (.xlsx) tai PowerPoint (.pptx). Voit myös tulostaa PDF:n ja tallentaa JSON-varmuuskopion jatkamista varten.

Kuvaus yhdistää toteutuksen ja yhteistyön. Aihekohtaiset ehdotukset auttavat kokoamaan tarvittavat toimialat ja kumppanit yhteiseen valmisteluun. Vastuuhenkilöä tai kustannuksia ei arvata. Ne voi jättää myöhemmin sovittavaksi. Laajuuden vaihtaminen muuttaa vain kuvausta; itse muokattua kuvausta ei korvata ilman vahvistusta.

Erilliset resurssi-, tulos-, kohde- ja työvaihekentät sekä kahden vuoden toistettavuusarvio on poistettu lomakkeesta. Vaikutusarvio ja perustelut ovat yhdessä kentässä. Kohteen ja toteutustavan rajaus kirjataan kuvaukseen. Lähtötilanteen erillistä arviointivaihetta ei ole: seuranta tehdään Ilmastopolussa. Vaikutusarvio voi silti edellyttää kohteen kulutus- tai kustannustietoja.

Kustannusvalikon vaihtoehdot ovat: Ei vielä arvioitu; Ei erillistä määrärahaa; Alle 5 000 €; 5 000–19 999 €; 20 000–99 999 €; 100 000–499 999 €; Vähintään 500 000 €. Arvio koskee koko toteutusta, eikä työkalu laske sitä automaattisesti.

Pelkällä ”edistetään”, ”tuetaan” tai ”kannustetaan” alkava nimi pyydetään täsmentämään. Tarkistus tunnistaa nämä aloitukset, mutta ei takaa vapaan tekstin laatua. Toimenpiteet on yleistetty kunnasta riippumattomiksi työehdotuksiksi; soveltuvuus riippuu kunnan olosuhteista.

## Aineisto

Pankissa on **895 aineistoista muokattua kirjausta, 52 sovellettua ideaa ja 30 työvaiheiksi avattua toteutusmallia**, yhteensä 977 taustakirjausta. Kaikki 947 lähteistä koottua tai sovellettua kirjausta on toimitettu yleiseen muotoon. Versiossa 0.7 aiemmat 499 eri otsikkoa on yhdistetty sisällön perusteella 239 yleiseksi toimenpiteeksi. Pelkkä rakennustyyppi, sanamuoto tai saman työn toteutusvaihe ei enää muodosta uutta toimenpidettä. Esimerkiksi aurinkopaneelien asennukset, lisäeristykset, LED-valaistukseen vaihtaminen ja lämpöpumppujen asennukset on yhdistetty. Eri tavoitteita palvelevat työt, kuten asennus, yhteishankinnan järjestäminen ja kaavoitus, säilyvät erillisinä. Taustakirjausten määrä on edelleen 977; aineistoa ei ole kasvatettu eikä poistettu tässä yhdistelyssä.

| Aineisto | Kirjauksia |
| --- | ---: |
| Pohjois-Karjalan kahdeksan kunnan Excel-aineisto | 464 |
| Liperin kestävän kehityksen ohjelma | 33 |
| Kannonkosken ilmastosuunnitelma | 57 |
| Hinku-kuntien ilmastoteot 2024 | 227 |
| Asikkalan ilmastosuunnitelma | 25 |
| Iisalmen ilmastosuunnitelman päivitys | 77 |
| Pielaveden ilmastosuunnitelma | 12 |
| Toiseen Beta 1.0 -versioon laaditut sovelletut ideat | 52 |
| Tämän demon muokattavat toteutusmallit | 30 |

Laajennuksessa hyödynnettiin käyttäjän aiemman `Ilmastotoimenpidepankki_Beta_1_0.html`-version 956 kirjauksen aineistoa. Ensimmäiset 497 kirjausta olivat jo mukana tässä demossa, joten niitä ei lisätty toistamiseen. Muista 459 kirjauksesta jätettiin pois viisi pelkkää toteuma- tai tavoitelukua ja yhdistettiin neljä keskenään identtistä kirjausta. Lisäksi siistittiin poiminnan tavutus- ja sivunumerovirheitä. Aiemman version jokaisen poiminnan oikeellisuutta ei ole tarkistettu uudelleen alkuperäisen PDF:n sivukuvaa vasten.

`source/data.json` sisältää aiemmat 497 alkuperäistä kirjausta muuttamattomina. `source/supplemental.json` sisältää 450 lisäkirjausta ja alkuperäisen poiminnan tiedot. `source/import-audit.json` dokumentoi mukaan otetut, yhdistetyt ja poistetut kirjaukset. `source/editorial.json` sisältää kaikki 947 yleiseen muotoon toimitettua otsikkoa tunnisteittain ja `source/editorial-audit.json` kuvaa toimitusperiaatteet. Sovellus käyttää vain toimitettuja tekstejä; alkuperäisiä kuvauksia ei siirretä hakuihin tai toimenpiteiden tietoihin. Kirjaukset ovat sovellettuja ehdotuksia, eivät suoria lainauksia. `source/models.json` sisältää 30 toteutusmallia, ja `source/sources.json` säilyttää mallien tarkemman lähdetaustan. Alkuperäiset PDF:t ja Excel eivät sisälly pakettiin.

Käyttäjälle lähteet esitetään yhdessä **Aineisto ja arviointiperiaatteet** -osiossa. Toimenpiteiden nimien perässä ei näytetä lähdekuntaa, eikä muokkaus-, suunnitelma-, CSV- tai tulostusnäkymässä toisteta toimenpidekohtaisia lähdeviitteitä. Sisäinen alkuperätieto säilyy aineistossa ja varmuuskopioissa.

## Sisältöön perustuva yhdistäminen

`source/consolidation.json` määrittelee kaikki 239 ryhmää ja niiden 977 alkuperäistä tunnistetta. `source/consolidation-audit.json` sisältää lisäksi aiemmat yleiset otsikot ja yhdistämisperiaatteet. Moniosainen lähtökirjaus on sijoitettu pääsisältönsä mukaiseen ryhmään; kaikki sen lisäosat eivät ole uuden toimenpiteen pakollisia töitä. Alkuperäisiä lähdetiedostoja ei ole muutettu. Haku tunnistaa sekä uuden otsikon että aiemmat yleiset sanamuodot. Tarkka rakennus tai kohde on valinnainen kunnan oman kuvauksen tarkennus.

## Vaikutusten arviointi ja kuvauspohjat

`source/proposal.js` sisältää 30 aihekohtaista kuvaus-, yhteistyö-, seuranta- ja vaikutuspohjaa sekä yleisen valmistelupohjan. Yhdistetyille toimenpiteille on valittu aihekohtainen malli toimitustyössä. Alkuperäisten kirjausten aiempi avainsanamallinnus säilyy taustalla yhteensopivuutta varten. Kuvaus ja vaikutukset ovat muokattavia ehdotuksia, eivät kohteesta tehtyjä selvityksiä tai tekoälyn tulkintoja käyttäjän tekstistä. Kunta tarkistaa ehdotuksen soveltuvuuden. Vaikutussuodatin kuvaa tavoitetta, ei vaikutuksen määrää tai paremmuusjärjestystä. Työkalu ei laske päästövähennyksiä, kustannuksia tai kokonaispisteitä.

## Tallennus ja vienti

Työ tallentuu selaimeen yhtenä omana suunnitelmana. Version 0.7 yhdistäminen koskee pankin valikoimaa: aiemmin tallennettuja kuntien omia toimenpiteitä, otsikoita tai kuvauksia ei yhdistetä eikä korvata automaattisesti. Kaikki aiemmat tunnisteet toimivat varmuuskopioissa. Pankissa valittuna näkyvä merkintä tunnistaa myös yhdistämistä edeltävän toimenpiteen. Versio 0.8 käyttää samaa tallennusavainta kuin versiot 0.3–0.7. Aiemmat työvaiheet yhdistetään näytöllä kuvaukseksi, vastuuhenkilöiksi, aikatauluksi ja seurannaksi. Vuosien lisäksi aiemmat vuosineljännekset säilyvät aikataulussa. Alkuperäiset työvaiheet, myös niiden resurssi- ja tulostiedot, säilyvät varmuuskopiossa. Niitä ei enää esitetä erillisinä lomakekenttinä tai CSV-sarakkeina.

Tämän demon aiemmat varmuuskopiot voi tuoda. Erillisen Beta 1.0 -sovelluksen tallennusmuotoa ei tueta sellaisenaan. Palautus tarkistaa muodon ja tunnisteet ja pyytää vahvistuksen ennen avoimen työn korvaamista.

Word-, Excel- ja PowerPoint-viennit sisältävät kaikki suunnitelmaan lisätyt toimenpiteet ja niiden kirjatut tiedot. Tiedostot ovat aitoja, muokattavia DOCX-, XLSX- ja PPTX-tiedostoja. Ne muodostetaan paikallisesti selaimessa ilman verkkopalvelua. Pitkät kuvaukset jatkuvat Wordissa seuraaville sivuille, PowerPointissa jatkodioille ja Excelissä saman toimenpiteen jatkoriveille (Osa-sarake). Excelin tekstikenttiä ei tulkita kaavoiksi. Office-tiedostojen fontiksi on määritetty Ubuntu; jos sitä ei ole vastaanottajan laitteella, Office käyttää korvaavaa fonttia. Muokkauslomakkeen muutokset on ensin lisättävä tai päivitettävä suunnitelmaan.

CSV löytyy kohdasta Muut tiedostomuodot. CSV sisältää yhden rivin kutakin toimenpidettä kohti, puolipiste-erottimen ja UTF-8 BOM -merkistön. Kaavamerkillä alkava teksti suojataan Excel-kaavatulkinnalta. Toimenpidekohtaisia lähdeviitteitä ei viedä. PDF tehdään selaimen tulostustoiminnolla.

Keskustelun esikatselu ja paikallisen tiedoston avaaminen voivat rajoittaa selaintallennusta, latauksia ja tulostamista. Lataa varmuuskopio työskentelyn päätteeksi ja kokeile vientiä omassa selaimessa ennen työpajaa.

Suunnitelma on luonnos, kunnes kunta vahvistaa sen. Vahvistettuun asiakirjaan vaaditaan päätösviite ja -päivä. Suunnitelman sisällön muutos palauttaa tilan luonnokseksi. Aloitusvuoden vaihtaminen ei siirrä aiempia kirjauksia automaattisesti.

## Ulkoasu ja tarkistukset

Versiossa 0.8 teksti käyttää tiedostoon sisällytettyä Ubuntu-fonttia. Kenttien otsikoille, ohjeteksteille ja paikkamerkeille on asetettu suoraan tumma tekstiväri. Käytöstä poistettujen painikkeiden tekstiä ei häivytetä läpinäkyvyydellä. Leipätekstin oletuskoko on 18 px ja pienimpien ruututekstien 16 px selaimen oletusasetuksilla. Fonttikoot käyttävät suhteellisia rem-yksiköitä, joten selaimen tekstikokoasetukset vaikuttavat niihin. Toissijaisen tekstin väriä on tummennettu ja tiivistetty kirjainväli poistettu. Fontin vaihtaminen yksin ei takaa koko palvelun saavutettavuutta.

Valkoinen ylätunniste, vihreät korostukset ja tumma teksti mukailevat käyttäjän toimittaman Hämeen ilmastovahdin näkymän visuaalista suuntaa. Etusivulla käytetään käyttäjän toimittamaa Järvi 1.jpg -kuvaa optimoituna. Sivusto käyttää koko käytettävissä olevan leveyden. Kapeilla näytöillä taulukko ja lomake pinoutuvat. Keskustelun esikatselun leveys riippuu keskustelun käyttöliittymästä.

Version 0.8 vientitarkistukset kattavat kaikkien kolmen Office-tiedostomuodon ZIP- ja XML-rakenteet, viittaukset, tietojen säilymisen myös pitkillä teksteillä, kaavamerkkien käsittelyn, vahvistustietojen tarkistuksen sekä sen, ettei vienti muuta suunnitelmaa. Word- ja PowerPoint-esimerkkien asettelut on tarkistettu renderöidyistä kuvista. Microsoft Office -sovellusten omia avaus- ja lataustoimintoja ei ole testattu tässä ympäristössä.

Version 0.7 tarkistukset kattavat kaikkien 977 tunnisteen kuulumisen täsmälleen yhteen ryhmään, keskeisten kohdeversioiden yhdistymisen, erillisten tarkoitusten säilymisen, hakujen toiminnan ja aiempien suunnitelmien säilymisen. Automaattiset tarkistukset kattavat lisäksi aineiston, yleiset otsikot, tunnisteet, mallien yhdistämisen, haun, kuvauspohjat, vanhojen kirjausten yhdistämisen, varmuuskopioiden yhteensopivuuden ja uuden CSV-viennin. JavaScriptin syntaksi ja itsenäisen selainversion rakentuminen tarkistetaan. Version 0.6 selaintarkistus estyi automaattisessa hyväksyntätarkistuksessa työtilan käyttöhyvitysten loputtua. Uutta ulkoasua ja vuorovaikutusta ei siten ole varmistettu selaimessa. Saavutettavuusauditointia ei ole tehty.

Tunnukset ovat alkuperäisiä tiedostoja, ja niiden oikeudet säilyvät haltijoilla. Ubuntu: Copyright 2011 Canonical Ltd., Ubuntu Font Licence 1.0. Maisemakuva on käyttäjän toimittama.

## Kehittäminen

Muokkaa `source`-hakemiston tiedostoja. Suorita siellä `python3 build.py`, `node tests.cjs` ja `node test-office.cjs`. Vientitesti kirjoittaa tarkistustiedostot source-hakemiston viereiseen `qa-office`-hakemistoon. Selainversio syntyy tiedostoon `source/dist/index.html`. Valinnainen `--inline-output POLKU` tuottaa keskustelun esikatselun. Rakentaminen käyttää Pythonin vakiokirjastoa. `extract_data.py` tarvitsee alkuperäiset liitteet, niiden lukukirjastot ja polkujen sovituksen omaan ympäristöön.
