(function(global){
'use strict';
// Editorial drafting aids. Suggestions are local templates, not site-specific assessments.
const books={
'building-energy':[
'Tarkistetaan kulutustiedot ja tilojen käyttöajat, sovitaan säädöt ja mitataan kulutuksen muutos vertailukelpoisissa oloissa.',
'Tilapalvelut ja tilojen käyttäjät sopivat käyttöajoista yhdessä. Kunnan energianhallinta kokoaa mittaustiedot ja hankintapalvelut valmistelevat tarvittavat ostot.',
'Energiankulutus (kWh), tehdyt säädöt ja sisäolosuhteet ennen ja jälkeen muutoksen.',
'Energiankulutus ja käyttökustannukset voivat pienentyä. Säästö arvioidaan kulutusseurannasta; samalla tarkistetaan, etteivät sisäolosuhteet heikkene.',
'Mitä rakennuksia tai laitteita työ koskee? Onko käyttöajoista ja kulutuksesta yhteinen tieto?'],
'lighting':[
'Inventoidaan valaisimet, valitaan uusittavat kohteet ja sovitaan valaistuksen ohjaus käyttöaikojen sekä turvallisuuden mukaan.',
'Tekniset palvelut, tilojen tai reittien käyttäjät ja hankintapalvelut valmistelevat ratkaisun yhdessä. Käyttäjiltä kerätään palaute valaistuksesta.',
'Uusitut valaisimet (kpl), valaistuksen sähkönkulutus (kWh) ja palaute turvallisuudesta.',
'Sähkönkulutus ja huoltokustannukset voivat vähentyä. Arvioinnissa verrataan kulutusta ja valaistuksen laatua sekä vältetään tarpeetonta valosaastetta.',
'Rajataanko työ rakennuksiin, katualueeseen vai liikuntapaikkaan? Milloin valaistusta tarvitaan?'],
'heating':[
'Vertaillaan kohteeseen sopivat lämmitysratkaisut, mitoitetaan valittu järjestelmä ja sovitaan käyttöönotosta sekä kulutusseurannasta.',
'Tilapalvelut kokoavat rakennusten tiedot, kunnan energianhallinta vertaa vaihtoehdot ja talous- sekä hankintapalvelut valmistelevat investoinnin.',
'Korvatut lämmityskohteet (kpl), polttoaineen ja sähkön kulutus sekä lämmityskustannukset.',
'Fossiilisen polttoaineen käyttö voi vähentyä. Kokonaisvaikutus riippuu korvaavasta lämmöstä, sähköstä, järjestelmän hyötysuhteesta ja investoinnin kustannuksista.',
'Mikä lämmitysjärjestelmä korvataan ja missä kohteessa? Mitä vaihtoehtoja vertaillaan?'],
'solar':[
'Tarkistetaan katon tai maa-alueen soveltuvuus ja sähkön kulutusprofiili. Mitoitetaan järjestelmä, kilpailutetaan toteutus ja järjestetään tuotannon seuranta.',
'Tilapalvelut vastaavat kohdetiedoista, hankintapalvelut kilpailutuksesta ja kunnan energianhallinta tuotannon sekä omakäytön seurannasta. Investointi valmistellaan talouspalvelujen kanssa.',
'Asennettu teho (kWp), tuotettu sähkö (kWh) ja tuotannon omakäyttöosuus (%).',
'Ostosähkön tarve voi pienentyä. Taloudellinen hyöty riippuu mitoituksesta, omakäytöstä ja sähkön hinnasta; päästövaikutus riippuu korvattavasta sähköstä.',
'Minkä laajuisena asennukset toteutetaan? Kohteet voi nimetä myöhemmin. Miten tuotanto hyödynnetään?'],
'space-use':[
'Kootaan tilojen käyttöaste ja käyttäjien tarpeet. Sovitaan yhteiskäytöstä, varauksista ja muutosta sekä seurataan tilojen käyttöä.',
'Tilapalvelut ja palveluista vastaavat toimialat valmistelevat tilaratkaisun yhdessä käyttäjien kanssa. Kunnan johto ratkaisee palveluverkkoa koskevat muutokset.',
'Käytössä oleva pinta-ala (m²), tilojen käyttöaste ja ylläpidon kustannukset.',
'Lämmitettävä pinta-ala ja ylläpitokulut voivat vähentyä. Arvioinnissa tarkistetaan myös palvelujen saavutettavuus ja käyttäjien tarpeet.',
'Mitkä toiminnot voivat jakaa tilan? Muuttuvatko palvelujen saavutettavuus tai aukioloajat?'],
'procurement':[
'Kirjataan hankinnan mitattavat energia-, materiaali- tai päästökriteerit tarjouspyyntöön. Käydään markkinavuoropuhelu ja sovitaan kriteerien todentamisesta sopimuskaudella.',
'Hankinnan käyttäjät määrittelevät toiminnallisen tarpeen. Hankintapalvelut, ilmastotyön koordinaatio ja talouspalvelut kokoavat yhteiset kriteerit ja vertailutiedot.',
'Kriteerit sisältävät hankinnat (kpl/€) ja sovittujen vaatimusten toteutuminen.',
'Hankinnan ilmasto- ja materiaalivaikutukset voivat pienentyä. Elinkaarikustannus, saatavuus ja vaatimusten todentaminen arvioidaan ennen hankintaa.',
'Mikä hankinta tai rakennushanke on kyseessä? Mitkä vaatimukset voidaan todentaa?'],
'reuse':[
'Kootaan käyttökelpoiset tavarat yhteiseen luetteloon. Sovitaan korjauksesta, varauksesta, kuljetuksesta ja uudelleenkäytöstä ennen uusien hankintaa.',
'Toimialat ilmoittavat vapaat tavarat yhteiseen palveluun. Tilapalvelut ja hankintapalvelut sopivat varastoinnin, korjauksen ja kuljetuksen käytännöt.',
'Uudelleen käytetyt tai korjatut tuotteet (kpl) ja vältetyt uushankinnat (€).',
'Uusien tuotteiden tarve ja materiaalikulutus voivat vähentyä. Hyötyä verrataan korjauksen, varastoinnin ja kuljetuksen kustannuksiin.',
'Mitä tavaroita voidaan käyttää uudelleen? Kuka hoitaa yhteisen varaus- ja kuljetuskäytännön?'],
'waste-sorting':[
'Tarkistetaan keräyspisteet ja jätelajit, täydennetään astiat ja opasteet sekä opastetaan käyttäjät. Seurataan sekajätteen ja lajiteltujen jakeiden määriä.',
'Jätehuolto, tilapalvelut, siivouspalvelut ja tilojen käyttäjät sopivat yhtenäiset keräyskäytännöt. Kunnan viestintä kokoaa yhteiset ohjeet.',
'Sekajätteen määrä (kg), lajitellut jakeet (kg) ja korjatut lajittelupisteet (kpl).',
'Materiaalien hyötykäyttö voi lisääntyä ja sekajäte vähentyä. Astiat, tyhjennysrytmi ja käyttäjien toiminta ratkaisevat toteutuvan hyödyn.',
'Mistä kohteista tai jätelajeista aloitetaan? Onko keräys mahdollista käytännössä?'],
'food-waste':[
'Punnitaan valmistus-, tarjoilu- ja lautashävikki sovitulla jaksolla. Muutetaan tilaus- ja valmistusmääriä sekä annostelua tulosten perusteella ja verrataan muutosta.',
'Ruokapalvelut, koulujen tai palveluyksiköiden henkilöstö ja ruokailijat sopivat kokeilusta yhdessä. Kunnan hankintapalvelut osallistuvat tarvittaessa raaka-aineiden tilauskäytäntöjen muutoksiin.',
'Ruokahävikki (g/annos), valmistetut ja syödyt annokset sekä hävikin kustannus (€).',
'Ruoantuotannon tarpeettomat päästöt ja hankintakulut voivat pienentyä. Seurannassa erotetaan hävikin väheneminen ruokailijamäärän muutoksesta.',
'Missä keittiössä tai ruokailupisteessä aloitetaan? Miten punnitus ja ruokailijamäärä kirjataan?'],
'meals':[
'Testataan ruokalistaa ja reseptejä ruokailijoiden kanssa. Valitaan maistuvat, ravitsemuksellisesti sopivat vaihtoehdot ja seurataan menekkiä sekä hävikkiä.',
'Ruokapalvelut, hankintapalvelut ja koulujen tai muiden ruokailupisteiden edustajat valmistelevat muutoksen yhdessä. Ruokailijoiden palaute otetaan mukaan reseptien valintaan.',
'Valittujen annosten osuus (%), menekki, ruokahävikki ja asiakaspalaute.',
'Aterioiden ilmastovaikutus voi pienentyä. Arvioinnissa huomioidaan ravitsemus, hyväksyttävyys, raaka-aineiden hinnat ja hävikki.',
'Mitä aterioita muutetaan? Miten ruokailijat osallistuvat reseptien testaamiseen?'],
'active-travel':[
'Kartoitetaan reitin tai palvelupisteen puutteet käyttäjien kanssa. Toteutetaan valitut korjaukset ja sovitaan kunnossapidosta sekä käytön seurannasta.',
'Liikennesuunnittelu, kunnossapito ja koulujen tai työpaikkojen edustajat valitsevat kohteet yhdessä. Käyttäjät osallistuvat turvallisuuspuutteiden tunnistamiseen.',
'Korjatut kohteet (kpl), kävely- ja pyöräilymäärät sekä käyttäjäpalaute.',
'Autolla tehtäviä lyhyitä matkoja voi korvautua kävelyllä tai pyöräilyllä. Mahdollisia hyötyjä ovat liikkumisen turvallisuus ja terveys; vaikutus riippuu käytön muutoksesta.',
'Mikä reitti, pysäköintipaikka tai käyttäjäryhmä on ensisijainen? Miten kunnossapito hoidetaan?'],
'fleet':[
'Kootaan ajosuoritteet ja kaluston käyttötarpeet. Vertaillaan soveltuvat ajoneuvot elinkaarikustannuksineen ja sovitaan latauksesta tai tankkauksesta sekä käytön seurannasta.',
'Kalustoa käyttävät toimialat ja hankintapalvelut tekevät yhteisen tarvearvion. Tilapalvelut selvittävät latauksen ja talouspalvelut investoinnin ajoituksen.',
'Kaluston käyttövoima, ajokilometrit, energiankulutus ja kokonaiskustannukset.',
'Liikenteen päästöt voivat vähentyä, jos korvaava kalusto sopii käyttöön. Hankintahinta, käyttömäärä, energian hinta ja latausjärjestelyt vaikuttavat kustannuksiin.',
'Mikä kalusto uusitaan ja mihin käyttöön? Voiko useampi yksikkö jakaa saman ajoneuvon?'],
 'transport-services':[
'Kootaan matka- ja kuljetustarpeet yhteiseen reittitarkasteluun. Sovitaan palvelutasosta, kilpailutetaan tai kokeillaan valittu ratkaisu ja seurataan käyttöä.',
'Koulukuljetusten, asiointiliikenteen ja tavaralogistiikan vastuutoimijat kokoavat tarpeet yhdessä. Hankintapalvelut sekä liikennöitsijät osallistuvat toteutusmallin valmisteluun.',
'Ajokilometrit, matkustaja- tai kuormamäärä, palvelutaso ja kuljetuskustannukset.',
'Päällekkäinen ajo voi vähentyä ja palvelun käyttö lisääntyä. Arvioinnissa tarkistetaan matka-ajat, saavutettavuus ja kuljetusten luotettavuus.',
'Mitkä matkat tai kuljetukset voidaan yhdistää? Mitkä palvelutarpeet on turvattava?'],
'charging':[
'Selvitetään käyttäjätarve ja sähköliittymän kapasiteetti. Sovitaan sijoitus, toteuttaja, käyttöehdot ja ylläpito sekä seurataan käyttöastetta.',
'Tilapalvelut tai maankäyttö, verkkoyhtiö, hankintapalvelut ja mahdollinen operaattori valmistelevat toteutuksen yhdessä. Kunta ratkaisee oman roolinsa sijoittajana tai alueen tarjoajana.',
'Käytössä olevat latauspisteet (kpl), ladattu energia (kWh) ja käyttöaste.',
'Lataus voi mahdollistaa vähäpäästöisempää liikennettä. Hyöty ja taloudellinen kannattavuus riippuvat käyttäjämäärästä, liittymästä ja toteutusmallista.',
'Ketkä lataavat ja kuinka kauan? Toteuttaako kunta pisteen itse vai operaattorin kanssa?'],
'planning':[
'Kootaan vaihtoehtojen liikkumista, energiaa, hiilivarastoja ja ilmastoriskejä koskevat tiedot. Verrataan vaihtoehdot ja kirjataan valitut ratkaisut suunnitelmaan.',
'Kaavoitus kokoaa valmisteluun liikenteen, ympäristönsuojelun, teknisten palvelujen ja maanomistajien tiedot. Vaikutusvertailu esitetään päätöksentekijöille ennen ratkaisun valintaa.',
'Ilmastovaikutuksiltaan vertaillut vaihtoehdot ja suunnitelmaan kirjatut ratkaisut.',
'Maankäyttö vaikuttaa pitkällä aikavälillä liikenteeseen, energiankäyttöön, hiilivarastoihin ja ilmastoriskeihin. Vaihtoehtojen erot arvioidaan samalla rajauksella.',
'Mikä suunnittelualue tai kaava on kyseessä? Mitkä vaihtoehdot voidaan vielä aidosti valita?'],
'forests':[
'Kootaan kohteen puusto-, luonto- ja riskitiedot. Vertaillaan käsittelyvaihtoehdot ja sovitaan valitun ratkaisun toteutus sekä seuranta.',
'Metsäomaisuuden hoito, ympäristönsuojelu ja kunnan talousvalmistelu tekevät yhteisen vaihtoehtovertailun. Tarvittaessa käytetään metsä- ja luontoasiantuntijaa.',
'Käsittelyalue (ha), valittu hoitotapa ja hiili-, luonto- sekä riskivaikutusten seuranta.',
'Vaikutukset hiilivarastoon, monimuotoisuuteen, metsätalouden tuottoihin ja tuhoriskeihin riippuvat kohteesta sekä tarkasteluajasta. Hyötyjä ei oleteta samoiksi kaikilla kuvioilla.',
'Mitä metsäkuvioita työ koskee? Millä tiedolla hiili-, luonto- ja talousvaikutuksia vertaillaan?'],
'peat-restoration':[
'Selvitetään maanomistus, vesitalous ja luontoarvot. Laaditaan kohdesuunnitelma, sovitaan luvat ja rahoitus sekä järjestetään vedenpinnan ja vesistövaikutusten seuranta.',
'Kunnan maaomaisuuden hoito ja ympäristönsuojelu kokoavat maanomistajat sekä ennallistamisasiantuntijan yhteiseen valmisteluun. Päätöksentekoon tuodaan kustannukset ja mahdolliset naapurivaikutukset.',
'Kunnostettu ala (ha), vedenpinnan taso ja sovitut luonto- sekä vesistömittarit.',
'Ennallistaminen voi muuttaa turpeen päästöjä, vedenpidätystä ja luontoarvoja. Vaikutus riippuu lähtötilasta; myös metaani ja vesistökuormitus arvioidaan kohdekohtaisesti.',
'Mikä suo- tai turvemaakohde on kyseessä? Mihin vedenpinnan muutos voi vaikuttaa?'],
'water-storm':[
'Kootaan valuma-alueen ja veden kulkureittien tiedot. Vertaillaan kunnostus- tai vesienhallintaratkaisut ja sovitaan toteutuksesta, kunnossapidosta sekä seurannasta.',
'Tekniset palvelut, ympäristönsuojelu ja maankäyttö valmistelevat ratkaisun vesihuollon sekä maanomistajien kanssa. Ylä- ja alapuolisten alueiden vaikutukset käsitellään yhdessä.',
'Toteutetut kohteet, veden kulku tai pidätystilavuus sekä havaitut tulva- tai kuormitushaitat.',
'Tulva- ja kuormitushaitat voivat vähentyä ja vesiluonnon tila parantua. Ratkaisun toiminta, kunnossapito ja vaikutukset muualla valuma-alueella on arvioitava.',
'Missä vesi aiheuttaa haittaa tai ekologinen yhteys katkeaa? Kuka omistaa alueen ja ylläpitää rakenteet?'],
'adaptation':[
'Tunnistetaan palvelun sää- ja häiriöriskit, sovitaan toimintaohje ja harjoitellaan se. Toteutetaan havaitut korjaukset ja tarkistetaan valmius säännöllisesti.',
'Kunnan valmiusjohto, tekniset palvelut ja kyseisen palvelun henkilöstö valmistelevat toiminnan yhdessä. Tarvittavat pelastus-, vesihuolto- ja muut kumppanit otetaan mukaan harjoitukseen.',
'Korjatut riskikohteet, toteutetut testit tai harjoitukset ja palvelukatkojen kesto.',
'Sään aiheuttamat vahingot tai palvelukatkot voivat vähentyä. Arvioinnissa tunnistetaan myös haavoittuvat käyttäjäryhmät ja varajärjestelmien toimintavarmuus.',
'Mikä palvelu tai kohde on vaarassa? Milloin toimintaohje tai tekninen ratkaisu testataan?'],
'meadow':[
'Rajataan kohde luontoarvojen perusteella, sovitaan hoitotapa ja toteutetaan työ oikeaan vuodenaikaan. Järjestetään jälkihoito ja seurataan kasvillisuuden muutosta.',
'Viheralueiden hoito ja ympäristönsuojelu sopivat työn yhdessä maanomistajien sekä mahdollisten yhdistys- tai nuorisotoimijoiden kanssa. Kunta järjestää opastuksen ja hoidon jatkuvuuden.',
'Hoidettu ala (m²/ha), hoitokerrat ja valittujen kasvi- tai vieraslajien havainnot.',
'Luonnon monimuotoisuus voi vahvistua. Vaikutus riippuu kohteen lähtötilasta ja hoidon jatkuvuudesta; päästö- tai kustannushyötyä ei oleteta automaattisesti.',
'Mikä alue ja hoitotapa valitaan? Kuka huolehtii niittojätteestä tai torjunnan jälkiseurannasta?'],
'agriculture':[
'Kootaan vapaaehtoiset tilat ja sovitaan energia-, ravinne- tai vesitalousratkaisun kohdekohtainen tarkastelu. Valitaan kokeilu ja sovitaan seurannasta viljelijän kanssa.',
'Kunnan maaseutupalvelut kokoavat viljelijät ja neuvontaorganisaation yhteiseen valmisteluun. Tilat päättävät omista ratkaisuistaan, ja kunta järjestää sovitun yhteistyön.',
'Osallistuneet tilat ja toteutetut kokeilut sekä kohteen energia-, ravinne- tai vesitalousmittari.',
'Energian ja ravinteiden käyttö tai ilmastoriskit voivat vähentyä. Kannattavuus, sato, maaperä ja vesistövaikutukset arvioidaan tilakohtaisesti.',
'Mitä ratkaisua tiloilla tarkastellaan? Mikä on kunnan tehtävä ja mikä jää viljelijän päätettäväksi?'],
'governance':[
'Kootaan toimialojen ehdotukset yhteen, asetetaan toteutusjärjestys ja kirjataan päätökset kunnan talous- sekä toimintasuunnitelmaan. Sovitaan yhteinen seuranta.',
'Ilmastotyön koordinaatio kokoaa valmistelun, toimialat tuovat kohdetiedot ja talouspalvelut arvioivat kustannukset. Kunnan johto ja päätöksentekijät ratkaisevat yhteiset prioriteetit.',
'Päätetyt ja aikataulutetut toimet, niille varattu rahoitus ja etenemisen seuranta.',
'Vaikutus syntyy toteutuvien toimien kautta. Seurannassa tarkistetaan päätösten lisäksi, muuttuuko käytännön toiminta ja toteutuvatko sovitut toimet.',
'Mihin päätökseen tai talousarviokierrokseen valmistelu kytketään? Kuka kokoaa toimialojen tiedot?'],
'communication':[
'Valitaan kohderyhmä ja yksi käytännön toimintatapa. Tehdään selkeä ohje, järjestetään neuvonta ja kerätään palaute siitä, muuttuiko toiminta.',
'Kunnan viestintä ja aiheen asiantuntijat tekevät sisällön yhdessä. Kumppanit, kuten kirjasto, yhdistykset tai yrityspalvelut, auttavat tavoittamaan kohderyhmän.',
'Tavoitetut osallistujat, neuvontakerrat ja palautteessa ilmoitetut käytännön muutokset.',
'Neuvonnan ilmastovaikutus on välillinen ja riippuu toimintatapojen muutoksesta. Pelkkä näkyvyys tai osallistujamäärä ei osoita päästövähennystä.',
'Kenelle viestitään ja mitä heidän toivotaan tekevän käytännössä? Miten toiminnan muutos havaitaan?'],
'education':[
'Valitaan käytännön oppimistehtävä ja sovitaan sen toteutus koulujen tai päiväkotien kanssa. Osallistujat mittaavat tai dokumentoivat tuloksen ja esittelevät havaintonsa.',
'Sivistyspalvelut, opettajat ja ilmasto- tai ympäristöasiantuntija valmistelevat tehtävän yhdessä. Oppilaat ja tilojen käyttäjät osallistuvat toteutukseen.',
'Toteutetut oppimiskokonaisuudet, osallistujat ja tehtävässä mitattu käytännön muutos.',
'Osaaminen ja osallistuminen voivat vahvistua. Suora ilmastohyöty riippuu toteutetusta kokeilusta, kuten energian tai ruokahävikin vähenemisestä.',
'Mille ikäryhmälle tehtävä sopii? Mitä osallistujat tekevät ja havainnoivat itse?'],
'building-envelope':[
'Tutkitaan rakenteiden kunto ja lämpövuodot. Sovitetaan korjaukset muun remontin aikatauluun ja tarkistetaan korjausten jälkeen energiankulutus sekä sisäolosuhteet.',
'Tilapalvelut, rakennuksen käyttäjät ja korjaussuunnittelijat kokoavat tarpeet. Talous- ja hankintapalvelut valmistelevat korjauksen ajoituksen ja hankinnan.',
'Korjatut rakenteet, lämmitysenergiankulutus ja sisäolosuhteiden seuranta.',
'Lämpöhäviöt ja lämmityskustannukset voivat vähentyä. Kosteustekninen toimivuus, ilmanvaihto ja korjauksen elinkaarikustannukset tarkistetaan.',
'Mikä rakennus tai rakenne korjataan? Mihin muuhun remonttiin työ voidaan yhdistää?'],
'water-saving':[
'Tarkistetaan vedenkulutus, vuotokohdat ja kalusteet. Korjataan havaitut puutteet, säädetään virtaamat ja seurataan veden sekä lämpimän käyttöveden energiankulutusta.',
'Tilapalvelut ja vesihuolto kokoavat kulutustiedot. Tilojen käyttäjät ilmoittavat vuodoista ja osallistuvat toimivuuden tarkistamiseen.',
'Vedenkulutus (m³), korjatut vuodot ja lämpimän käyttöveden energiankulutus.',
'Veden ja sen lämmitysenergian käyttö voivat vähentyä. Hygienia ja kalusteiden käyttötarkoituksen mukainen toiminta on turvattava.',
'Missä kulutusta mitataan ja mistä vuotoja etsitään? Miten toimivuus varmistetaan muutoksen jälkeen?'],
'material-masses':[
'Inventoidaan syntyvät ja tarvittavat materiaalit, tarkistetaan niiden soveltuvuus ja sovitetaan kuljetukset sekä työmaiden aikataulut yhteen.',
'Kunnan rakennuttajat, maankäyttö, hankintapalvelut ja urakoitsijat tekevät yhteisen materiaalitarkastelun. Ympäristöasiantuntija tarkistaa käytön edellytykset.',
'Uudelleen käytetty materiaali (t/m³), korvatut neitseelliset materiaalit ja kuljetusmatkat.',
'Neitseellisten materiaalien tarve ja kuljetuspäästöt voivat vähentyä. Laatu, haitta-aineet, soveltuvuus ja varastointitarve arvioidaan ennen käyttöä.',
'Mistä materiaali tulee ja missä sitä tarvitaan? Kohtaavatko laatuvaatimukset ja työmaiden aikataulut?'],
'electricity-purchase':[
'Kootaan kunnan ja kuntakonsernin sähkönhankinnan tarpeet. Määritellään todennettavat alkuperävaatimukset, kilpailutetaan sopimus ja seurataan vaatimusten täyttymistä.',
'Hankintapalvelut, energianhallinta ja kuntakonsernin ostajat valmistelevat yhteiset vaatimukset. Talouspalvelut vertailevat sopimusten kustannukset ja riskit.',
'Sopimuksen kattama sähkönkulutus (kWh), alkuperän todentaminen ja kokonaiskustannus.',
'Hankitun sähkön laskennalliset päästöt voivat muuttua. Alkuperän todentaminen, raportointitapa ja hinnan vaikutus on erotettava fyysisestä energiankulutuksen muutoksesta.',
'Mitkä toimipisteet tai yhtiöt kuuluvat hankintaan? Miten alkuperävaatimukset todennetaan?'],
'remote-services':[
'Valitaan palvelu tai tila käyttäjätarpeen perusteella. Sovitaan välineet, saavutettavuus, opastus ja yhteiset käyttöehdot sekä seurataan käyttöä.',
'Palvelun vastuutoimiala, tietohallinto, tilapalvelut ja asiakasneuvonta suunnittelevat toteutuksen yhdessä. Käyttäjät osallistuvat kokeiluun.',
'Käyttökerrat, korvautuneet asiointimatkat ja käyttäjäpalaute.',
'Matkustamisen tarve voi vähentyä ja palvelu olla helpommin saatavilla. Arvioinnissa huomioidaan digiosaaminen, esteettömyys ja vaihtoehtoinen asiointitapa.',
'Mikä asiointi tai työskentely siirtyy etäyhteydelle? Miten palvelu toimii myös tukea tarvitseville?'],
'energy-production':[
'Kootaan energia-, raaka-aine- ja kulutustiedot. Vertaillaan tekniset ratkaisut, päästöt, kustannukset ja toimitusvarmuus sekä valmistellaan toteuttajien työnjako.',
'Kunnan energianhallinta, energiayhtiö, alueen yritykset ja maankäyttö kokoavat vaihtoehdot. Investoinnin vastuut ja rahoitus valmistellaan talouspalvelujen kanssa.',
'Hyödynnetty tai korvattu energia (MWh), hankkeen kustannukset ja arvioidut päästöt samalla laskentarajauksella.',
'Fossiilista energiaa voi korvautua tai hukkalämpöä tulla käyttöön. Polttoaineiden saatavuus, sähköntuotanto, investointikulut ja toimitusvarmuus vaikuttavat kokonaisuuteen.',
'Mitä tuotantoa korvataan tai energiaa otetaan talteen? Kuka investoi ja kuka ostaa energian?']
};
const fallback=[
'Sovitaan kohteen rajaus ja toteutustapa yhteisessä valmistelussa. Valitaan ensimmäinen toteutettava työ, kirjataan päätös ja seurataan työn etenemistä.',
'Kunnan ilmastotyön koordinaatio kokoaa asian koskemat toimialat ja tarvittavat kumppanit yhteiseen valmisteluun. Talouspalvelut osallistuvat kustannusarvioon.',
'Sovittujen kohteiden määrä, toteutuksen eteneminen ja kohteessa havaittu muutos.',
'Hyödyt, mahdolliset haitat ja kustannukset arvioidaan valitun toteutustavan mukaan. Kirjataan myös, mitä tietoa tarvitaan ennen päätöstä.',
'Mikä kohde ja rajattu työ valitaan? Mitkä toimialat tai kumppanit tarvitaan toteutukseen?'];
const modes={pilot:'Rajattu kokeilu',joint:'Kunnan yhteinen toteutus',expand:'Toiminnan laajentaminen'};
function guide(a){return books[a.modelId]||fallback;}
function proposal(a,mode='joint'){
 const b=guide(a),preparation=/^(laaditaan|kartoitetaan|vertaillaan|verrataan|selvitetään|teetetään|päivitetään|kirjataan|valmistellaan|määritellään)/i.test(a.title);
 const scope=mode==='pilot'?'Rajataan työ yhteen soveltuvaan kohteeseen tai rajattuun kokeiluun. Tulokset arvioidaan ennen laajentamista.':mode==='expand'?'Kootaan aiemman toteutuksen kokemukset ja valitaan niiden perusteella seuraavat kohteet. Toimivaa käytäntöä laajennetaan sovitussa järjestyksessä.':'Kootaan soveltuvat kohteet yhteiseen toteutuskokonaisuuteen ja sovitaan niiden toteutusjärjestys.';
 const work=preparation?'Kootaan kohteen lähtötiedot ja vertaillaan toteutustavat, kustannukset sekä vaikutukset. Tuodaan yhteinen ehdotus päätettäväksi; jatkototeutus ajoitetaan päätöksen perusteella.':b[0];
 return {description:a.title.replace(/[.!?]+$/,'')+'. '+scope+'\n\n'+(a.description&&a.kind!=='template'?a.description+' ':'' )+work+'\n\n'+b[1],metric:b[2],impacts:b[3],team:b[1],question:b[4],mode};
}
function makeDraft(a,year){const p=proposal(a);return {id:a.id,title:a.title,description:p.description,owner:'',schedule:year+'–'+(year+1),costBand:'Ei vielä arvioitu',metric:p.metric,impacts:p.impacts,scope:'',theme:a.bankTheme||a.theme||'Oma toimenpide',modelId:a.modelId||'',mode:'joint',descriptionEdited:false,steps:[],phase:'Suunnitteilla',budget:'Selvitettävä',ratings:{},effects:{},rationale:'',originalTitle:a.title};}
const api={books,modes,guide,proposal,makeDraft};global.ClimateProposal=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
