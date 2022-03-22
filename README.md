# Polypet team F 
Projet Polypet du cours "Architecture logiciel pour le cloud computing".


## Membres

- Dina Abakkali 
- Sylvain Marsili 
- Thomas Martin
- Clément Poueyto
- Florian Striebel

## Répartition des points dans l'équipe
- Sylvain Marsilli : 100
- Thomas Martin : 100
- Clément Poueyto: 100
- Dina Abakkali : 100
- Florian Striebel : 100

## deployer polypet
Pour deployer les différents service de polypet voici la commande a taper
```console
cd <service>
npm run build
gcloud app deploy <service>.yaml
```
avec \<service\> un sous-dossier qui contient la chaine "polypet-f-"

## Comment lancer Les scénarios 

Pour les scénarios nous avons 3 cli différentes celle du client, de l'équipe marketing et du partenaire. vous pouvez dans les 3 clis taper les commandes "exit" pour quitter l'execution en cours et "command" pour obtenir la liste des différentes commandes executables.
Pour lancer les clis il faut vous placer dans le sous dossier [cli](https://github.com/pns-si5-cloud/cloud-21-22-cloud-polypet-21-22-f/tree/develop/cli) 

Pour lancer les script il vous faut au minimum [python3.9](https://www.python.org/)
ensuite lancer les commandes dans un terminal:
```console
cd ./cli
pip install -r requirements.txt
```
OU, en cas d'erreur:
```console
pip install requests
pip install tabulate
```

commande pour le lancement d'une cli 
```console
py <cliName>
```

### Scénario 1: Jeff arrive sur le site et achète un produit d’un gros partenaire
Pour lancer le scénario 1 exucuter la cli **customer_cli.py** avec la commande de lancement d'une cli puis entrer le nom du client ensuite taper les commandes suivantes :

```bash
# il recherche par mot clés la liste des produits : “chat” et “nourriture”
search
2
food,cat
# il rajoute le produit "croquette Nyancat" 3 fois a son panier
add
YLTBxnfZjHQU5krAGx3L
3
# il vérifie son panier et valide son contenu
cart

validate
<YourName>
<YourFirstName>
<YourAddress>
<YourCreditCardNumber>
```

### Scénario 2: Elon propose une réduction sur l'arbre à chat

Pour lancer ce scénario il faudra executer la cli **marketing_cli.py** avec la commande de lancement d'une cli puis entrer le nom de l'employé du marketing

```bash
# Elon regarde les statistiques et remarque que les ventes du produit phare “arbre à lapin”  commence à s'essouffler, 
analytics
2021-11-18
2
# Elon souhaite maintenant modifier ce produit au catalogue, il modifie donc la fiche produit en faisant une réduction de 30%.
discount
pqt7mvt19n6r9cc1dwMG
1
30

# Elon regarde les statistiques et observe une augmentation des consultations et ventes
analytics
2021-11-19
2

```

### Scénario 3: - Ajout de produit par un petit partenaire

Pour lancer ce scénario il faudra executer les 3 cli **marketing_cli.py**,**customer_cli.py** et **partner_cli.py** en ouvrant 1 terminal par cli

```bash
#John s’inscrit en tant que “ petit partenaire” PolyPet
## cli partner 
signup
NACSuits #partnerName
aPassWord
SMALL 

# Marie valide le profil partenaire de John
## cli marketing
accept
NACSuits 

# John  propose son “Rabbit Suits” en ajoutant un prix, une fiche produit
## cli partner 
addProduct
Rabbit Suits
suits,NAC,rabbit
A beautiful rabbit suits 
size 30cm
73.0
### get product partner id : <productPartnerId>

#Marie valide le produit,elle voit que John veut rajouter un produit sur PolyPet,elle voit que le produit est cohérent avec la gamme actuelle, elle valide donc le produit pour le proposer au catalogue
## cli marketing
acceptProduct
<productPartnerId>

### get product id : <productId>
# John envoie ses stocks dans l'entrepôt de Polytech et Celia ajoute la quantité de stock au système
addStock
<productId>
50

#le produit partenaire est commandé par 1 client
##cli customer
add
<productId>
1
validate
<YourName>
<YourFirstName>
<YourAddress>
<YourCreditCardNumber>

#John regarde ses ventes et voit qu'il a vendu un produit
##cli partner
soldProduct
```
