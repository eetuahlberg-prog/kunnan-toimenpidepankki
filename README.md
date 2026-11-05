# Ilmastosuunnitelman toimenpiteiden päivitys

Kokeiluversio 0.4, 5.11.2026. Yhteinen toimenpidepankki kuntien ilmastosuunnitelmien päivittämiseen. Tämä demo on tarkoitettu kokeiltavaksi ennen julkaisua; tämän työn yhteydessä ei ole julkaistu GitHubiin.

## Käyttö

Avaa paketin `index.html` selaimessa. Tiedot, kuvat, fontti ja ohjelmakoodi sisältyvät tiedostoon. Verkkoyhteyttä tai tunnuksia ei tarvita.

1. Seulo 977 vaihtoehdon pankkia hakusanalla, teemalla tai tavoitellulla vaikutuksella.
2. Avaa toimenpide listasta tai vetovalikosta. Listassa voi näyttää 20, 50 tai 100 riviä kerralla. Kuntavalikkoa ja toimenpidekohtaisia lähdeviitteitä ei ole.
3. Tutustu ehdotettuihin työvaiheisiin ja vaikutusten arviointikysymyksiin. Valitse **Muodosta tästä oma toimenpide**.
4. Täsmennä nimi, kohde, työvaiheet, vastuu, aikataulu, resurssit ja mittari. Kirjaa oma vaikutusarvio perusteluineen ja lisää toimi suunnitelmaan.
5. Kokoa valitut toimet vuosittain tai talousarvion kannalta. Vie CSV, lataa JSON-varmuuskopio tai avaa tulostettava suunnitelma.

Lähtötilanteen erillinen arviointivaihe on poistettu. Nykytilan seuranta tehdään Ilmastopolussa. Toimenpiteen vaikutusten arviointi voi silti vaatia kohteen lähtötietoja, kuten kulutus- tai kustannustietoja.

Kohde ja työn rajaus on nimettävä ennen suunnitelmaan lisäämistä. Pelkällä ”edistetään”, ”tuetaan” tai ”kannustetaan” alkava otsikko tai työvaihe pyydetään täsmentämään. Tarkistus tunnistaa nämä yleiset aloitukset; se ei tulkitse vapaata tekstiä tekoälyllä eikä takaa kirjauksen laatua. Pankin lähde-esimerkkien otsikot voivat olla yleisluonteisia: käyttäjän tehtävänä on muuttaa idea konkreettiseksi työksi.

## Aineisto

Pankissa on **895 aineistokirjausta, 52 sovellettua ideaa ja 30 työvaiheiksi avattua toteutusmallia**, yhteensä 977 vaihtoehtoa. Mukana on saman aiheen eri toteutustapoja ja eri aineistojen samankaltaisia kirjauksia; luku ei tarkoita 977 täysin erilaista toimenpidetyyppiä.

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

`source/data.json` sisältää aiemmat 497 alkuperäistä kirjausta muuttamattomina. `source/supplemental.json` sisältää 450 lisäkirjausta ja alkuperäisen poiminnan tiedot. `source/import-audit.json` dokumentoi mukaan otetut, yhdistetyt ja poistetut kirjaukset. `source/models.json` sisältää 30 toteutusmallia, ja `source/sources.json` säilyttää mallien tarkemman lähdetaustan. Alkuperäiset PDF:t ja Excel eivät sisälly pakettiin.

Käyttäjälle lähteet esitetään yhdessä **Aineisto ja arviointiperiaatteet** -osiossa. Toimenpiteiden nimien perässä ei näytetä lähdekuntaa, eikä muokkaus-, suunnitelma-, CSV- tai tulostusnäkymässä toisteta toimenpidekohtaisia lähdeviitteitä. Sisäinen alkuperätieto säilyy aineistossa ja varmuuskopioissa.

## Vaikutusten arviointi

Arviointituki perustuu kuntien suunnitelmien lisäksi Pohjois-Savon ja Päijät-Hämeen vaikuttavuusarviointeihin, Syken maankäyttösektorin oppaaseen, YM:n ilmastosuunnitelmaoppaaseen ja Ilmoniemen tutkielmaan.

Vaikutuskuvaukset erottelevat päästöt, hiilinielut, sopeutumisen, kunnan vaikutusmahdollisuudet, toteutettavuuden, kustannukset, taloudelliset hyödyt ja muut hyödyt. Vaikutussuodatin tarkoittaa toiminnan tavoitetta, ei vaikutuksen määrää tai paremmuusjärjestystä. Työkalu ei laske päästövähennyksiä, euromääriä tai kokonaispisteitä.

Toteutusmalli yhdistetään ideaan avainsanojen perusteella. Käyttäjä tarkistaa mallin sopivuuden ja voi vaihtaa sitä. Kirjaukset, joille mallia ei löydy, avautuvat tyhjälle muokkauspohjalle arviointikysymyksineen. Esimerkin toteuma, vastuu ja aikataulu eivät siirry oman toimenpiteen tiedoksi. Julkaisujen vanhoja säädös- ja rahoitustietoja ei esitetä nykyisin voimassa olevina ohjeina.

## Tallennus ja vienti

Työ tallentuu selaimeen yhtenä omana suunnitelmana. Versio 0.4 käyttää samaa tallennetta kuin versio 0.3. Sitä edeltäviä kuntakohtaisia selaintallenteita ei poisteta tai siirretä automaattisesti; siirrä ne varmuuskopion kautta. Tämän demon aiemmat varmuuskopiot voi tuoda. Erillisen Beta 1.0 -sovelluksen tallennusmuotoa ei voi tuoda sellaisenaan.

Keskusteluun upotettu demo ja paikallinen tiedosto voivat rajoittaa selaintallennusta, latauksia ja tulostamista. Lataa varmuuskopio työskentelyn päätteeksi. Palautus tarkistaa muodon ja tunnisteet ja pyytää vahvistuksen ennen avoimen työn korvaamista.

CSV käyttää puolipistettä ja UTF-8 BOM -merkistöä. Kaavamerkillä alkavat tekstit suojataan Excel-kaavatulkinnalta. Kohde ja rajaus sisältyvät CSV:hen ja tulostettavaan suunnitelmaan. PDF tehdään selaimen tulostustoiminnolla. Käytä tarvittaessa paketin erillistä selainversiota.

Suunnitelma on luonnos, kunnes kunta vahvistaa sen. Vahvistettuun asiakirjaan vaaditaan päätösviite ja -päivä. Suunnitelman sisällön muutos palauttaa tilan luonnokseksi. Suunnitteluvuosien vaihtaminen ei siirrä työvaiheita automaattisesti.

## Ulkoasu ja tarkistukset

Teksti on tummaa vaalealla pohjalla. Valkoisen tekstin taustana on tummanpunainen #AF0B2B; kirkas #E4003A säilyy korostuksissa. Aiemman version mitattu pienin tekstikontrasti oli noin 6:1. Samat tekstivärit ovat käytössä uudessa listassa. Tämä ei ole koko sovelluksen saavutettavuusauditointi.

Automaattiset tarkistukset kattavat 977 vaihtoehdon määrän, tunnisteet, alkuperäisten tietojen säilymisen, poiminnan kirjanpidon, mallien yhdistämisen, haun, vanhojen ja uusien kirjausten varmuuskopiot sekä lähdeviitteettömän CSV-viennin. Selainkokeessa tarkistettiin listan sivutus, haku, uuden kirjauksen muokkaus ja lisäys suunnitelmaan sekä tulostettava suunnitelma. Kapeassa 375 pikselin esikatselussa tarkistettiin listan reflow, suodattimet, vetovalinta ja vaakaylivuodon puuttuminen. CSV-latauksen ja käyttöjärjestelmän PDF-ikkunan toiminta on varmistettava omassa selaimessa ennen työpajakäyttöä.

Tunnukset ovat alkuperäisiä tiedostoja. Ubuntu: Copyright 2011 Canonical Ltd., Ubuntu Font Licence 1.0. Tunnusten oikeudet säilyvät niiden haltijoilla.

## Kehittäminen

Muokkaa `source`-hakemiston tiedostoja ja suorita siellä `node tests.cjs` ja `python3 build.py`. Selainversio syntyy tiedostoon `source/dist/index.html`. Valinnainen `--inline-output POLKU` tuottaa upotettavan esikatselun. Rakentaminen käyttää Pythonin vakiokirjastoa. `extract_data.py` tarvitsee alkuperäiset liitteet, niiden lukukirjastot ja liitepolun sovituksen omaan ympäristöön.
