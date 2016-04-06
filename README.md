jsDatePicker
============

## TO DO ##
- juste rafraichir le contenu des dates au changement des mois, années, jours ? (pour ne pas refaire les bind sur les boutons next et previous)
- avoir une fonction "beforeShow"
- vérifier si le format de la date du input est valide et si c'est une date valide (exemple 30/02/2014 n'est pas valide)

## Ameliorations ##
- Choix du jour de départ
- Bloquer complètement la saisie dans le champ texte (Cela évite au maximum les saisies bidon, le temps que tu fasses l’amélioration de correction des dates).
  -> Note : mettre le champ en “readonly” fonctionne très bien au pire.
- Au resize de la page, retirer le datepicker
- Pouvoir mettre une liste dans “container” pour faire un truc du genre : container: document.querySelectorAll(‘.datepicker’)
  -> Note : On peut très bien faire la boucle dans notre script
- Vérifier que le calendrier ne sort pas de l’écran.
  -> Sur mon iphone, le champs est à droite de la page (50% de largeur) et le calendrier sort de 20px (ce qui rajoute un scroll horizontale).