import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const monthsData = [
  {
    month: 1,
    name: "Enero",
    theme: "Fe, Nuevos Comienzos y Visión",
    daysCount: 31,
    topics: [
      { t: "Un nuevo comienzo", p: "2 Corintios 5:17", v: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.", r: "Pablo no dice que serás una nueva criatura algún día: dice que ya lo eres. El versículo no describe una meta, describe un hecho. Lo viejo no se está yendo poco a poco, ya pasó. Empieza este año sin arrastrar la versión de ti que Dios ya cerró. ¿Qué cosa vieja sigues cargando que Cristo ya declaró terminada?", d: "Soy nueva criatura en Cristo. Lo viejo quedó atrás y hoy vivo desde lo que Dios ya hizo en mí.", o: "Nombra delante de Dios una cosa del año pasado que aún cargas, y déjala hoy en sus manos." },
      { t: "Planes de bien", p: "Jeremías 29:11", v: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.", r: "Dios le dijo esto a un pueblo que estaba en el exilio, no en su mejor momento. La promesa no llegó cuando todo iba bien, llegó cuando todo estaba roto. Por eso te sirve hoy: los planes de Dios para ti no dependen de que tu situación se vea prometedora. Él ya conoce el final que te espera.", d: "Confío en que los planes de Dios para mí son de paz, aun cuando no entienda el camino.", o: "Cuéntale a Dios la situación que hoy no entiendes, y pídele que te muestre su plan en ella." },
      { t: "Caminar por fe", p: "2 Corintios 5:7", v: "Porque por fe andamos, no por vista.", r: "Andar por fe no es cerrar los ojos a la realidad; es no dejar que la realidad tenga la última palabra. La vista te dice lo que hay, la fe te dice quién está contigo. Pablo escribe «andamos», no «nos sentamos»: la fe se demuestra dando el siguiente paso, aunque solo alcances a ver ese.", d: "Hoy camino por fe. Lo que veo no define mi paso; lo define la palabra de Dios.", o: "Pide a Dios valor para dar hoy un solo paso que has estado posponiendo por miedo." },
      { t: "La certeza de lo que se espera", p: "Hebreos 11:1", v: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.", r: "Fíjate en las dos palabras que usa: certeza y convicción. La fe bíblica no es un «ojalá», es una seguridad. No es optimismo sobre el futuro, es confianza en el carácter de Quien lo sostiene. Por eso la fe puede convivir con la espera: no necesita ver el resultado para estar segura de Dios.", d: "Mi fe descansa en el carácter de Dios, no en lo que alcanzo a ver hoy.", o: "Agradece a Dios por algo que todavía no ves, pero que ya le has pedido en fe." },
      { t: "Nuevas misericordias", p: "Lamentaciones 3:22-23", v: "Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.", r: "Jeremías escribe esto en medio de un libro de lamentos, rodeado de ruinas. Y ahí, justo ahí, dice que las misericordias son nuevas cada mañana. No dice que el dolor terminó: dice que el amor de Dios no se agotó. Hoy tienes misericordia recién hecha, no las sobras de ayer.", d: "Cada mañana recibo misericordia nueva. Los errores de ayer no agotaron el amor de Dios por mí.", o: "Empieza tu oración agradeciendo tres cosas concretas que Dios te dio esta mañana." },
      { t: "Confianza total en Dios", p: "Proverbios 3:5-6", v: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.", r: "El texto no dice que tu prudencia sea mala, dice que no te apoyes en ella. Hay diferencia entre usar la cabeza y descansar en ella. Reconocerlo «en todos tus caminos» incluye los que crees tener resueltos. Ahí, en lo que ya dabas por seguro, es donde más falta hace preguntarle a Dios.", d: "Confío en Jehová de todo corazón y le entrego también las decisiones que creía tener resueltas.", o: "Presenta a Dios una decisión que ibas a tomar solo, y pídele dirección antes de avanzar." },
      { t: "El Dios de lo imposible", p: "Lucas 1:37", v: "Porque nada hay imposible para Dios.", r: "El ángel le dice esto a María justo cuando ella pregunta cómo será posible. Dios no se ofendió por la pregunta; respondió con su carácter. Tú también puedes preguntar cómo. Lo imposible no es un límite para Dios: es apenas el punto donde termina lo que tú puedes hacer y empieza lo que Él hace.", d: "Nada es imposible para Dios. Lo que a mí se me acabó, a Él apenas le empieza.", o: "Dile a Dios en voz alta aquello que has dado por imposible, y déjalo delante de Él." },
      { t: "Fuerza en la debilidad", p: "Isaías 40:29", v: "Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas.", r: "Dios no le da fuerza al que ya la tiene: se la da al cansado. La debilidad no te descalifica para recibir de Él, es precisamente la condición que menciona el versículo. Si hoy llegaste sin fuerzas, no estás fuera de la promesa; estás exactamente en el lugar donde ella aplica.", d: "Dios multiplica mis fuerzas justo donde yo no tengo ningunas.", o: "Dile a Dios en qué área estás cansado y pídele fuerza para hoy, no para todo el año." },
      { t: "Paz que sobrepasa entendimiento", p: "Filipenses 4:6-7", v: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.", r: "Pablo escribe esto preso, y aun así habla de gratitud. Fíjate en el orden: primero deja de afanarte, luego pide, y todo con acción de gracias. La paz no llega porque el problema se resuelva, llega porque lo pusiste en las manos correctas. Y esa paz queda montando guardia sobre tu corazón.", d: "Entrego hoy mis afanes en oración y recibo la paz de Dios que guarda mi corazón.", o: "Menciona el afán que traes hoy y entrégaselo a Dios dando gracias por adelantado." },
      { t: "Luz en tu camino", p: "Salmos 119:105", v: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", r: "Una lámpara de aceite alumbraba lo justo para el siguiente paso, no el camino entero. Así funciona la Palabra: rara vez te muestra el año completo, pero siempre alumbra dónde poner el pie ahora. Si te angustia no ver el final, recuerda que nunca fue esa la promesa. La luz alcanza para hoy.", d: "La Palabra de Dios alumbra mi próximo paso, y con eso me basta para caminar hoy.", o: "Pide a Dios claridad para una sola decisión de hoy, no para todo tu futuro." },
      { t: "Sembrar con fe", p: "Gálatas 6:9", v: "No nos cansemos, pues, de hacer bien; porque a su tiempo segaremos, si no desmayamos.", r: "«A su tiempo» es la parte incómoda del versículo. Pablo reconoce que hay un espacio entre sembrar y segar, y que en ese espacio dan ganas de rendirse. El cansancio no significa que sembraste mal, significa que todavía no es tiempo. Lo único que arruina la cosecha es desmayar antes de que llegue.", d: "No me canso de hacer el bien. A su tiempo segaré lo que hoy siembro con fe.", o: "Pide a Dios constancia en algo bueno que empezaste y has tenido ganas de abandonar." },
      { t: "Renovación de la mente", p: "Romanos 12:2", v: "No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento.", r: "La transformación no empieza por la conducta, empieza por el entendimiento. Pablo no dice «esfuérzate más», dice «renuévate por dentro». El molde de este siglo se te pega sin que lo notes, por eso hace falta algo activo que lo contrarreste. Lo que alimentas con tu mente termina decidiendo cómo vives.", d: "Renuevo mi entendimiento con la Palabra y no me amoldo a lo que este siglo dicta.", o: "Pregúntale a Dios qué idea del mundo has aceptado sin examinarla, y pídele su verdad." },
      { t: "Valentía y esfuerzo", p: "Josué 1:9", v: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.", r: "Dios se lo dice a Josué justo cuando toma el relevo de Moisés, con un pueblo entero mirándolo. La valentía no era un rasgo de su carácter, era un mandato con una razón detrás: «porque Jehová tu Dios estará contigo». No te manda ser valiente solo, te manda ser valiente acompañado.", d: "Me esfuerzo y soy valiente, porque Dios va conmigo dondequiera que yo vaya.", o: "Nombra el lugar o la conversación que hoy te da temor, y pide a Dios que vaya contigo allí." },
      { t: "Buscar primeramente el Reino", p: "Mateo 6:33", v: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", r: "Jesús dice esto a gente preocupada por comida y ropa, necesidades reales. No les dice que no importan, les dice que hay un orden. «Primeramente» no significa «únicamente». Cuando el Reino ocupa el primer lugar, lo demás encuentra el suyo. El problema nunca fue tener necesidades, sino ponerlas a gobernar.", d: "Busco primero el reino de Dios y confío en que lo demás vendrá por añadidura.", o: "Antes de pedir por tus necesidades, dedica un momento a pedir por la obra de Dios." },
      { t: "Dios suplirá todo", p: "Filipenses 4:19", v: "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.", r: "La medida no es tu urgencia ni tu esfuerzo: es «sus riquezas en gloria». Pablo lo escribe a una iglesia que acababa de dar de lo poco que tenía. Dios no suple según lo que a ti te queda, sino según lo que a Él le sobra. Y a Él nunca le falta.", d: "Mi Dios suplirá todo lo que me falta conforme a sus riquezas, no conforme a mis posibilidades.", o: "Presenta a Dios una necesidad concreta y agradécele por adelantado su provisión." },
      { t: "El poder de la alabanza", p: "Salmos 34:1", v: "Bendeciré a Jehová en todo tiempo; su alabanza estará de continuo en mi boca.", r: "David escribe esto huyendo, fingiendo locura para salvar la vida. «En todo tiempo» incluía ese momento. Bendecir a Dios no es informarle que todo va bien, es reconocer quién es Él aunque nada vaya bien. La alabanza que solo aparece en los días buenos todavía no ha sido probada.", d: "Bendigo a Jehová en todo tiempo; su alabanza está de continuo en mi boca.", o: "Alaba a Dios por algo de quién es Él, sin pedirle nada durante ese momento." },
      { t: "Permanecer en la vid", p: "Juan 15:5", v: "Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto.", r: "El pámpano no se esfuerza por dar uvas: permanece unido y el fruto viene. Jesús no dice «sin mí harán menos», dice «nada podéis hacer». Es una frase incómoda para quien vive produciendo. El llamado de hoy no es a rendir más, sino a no soltarte de donde viene la savia.", d: "Permanezco en Cristo, y de esa unión, no de mi esfuerzo, viene todo fruto en mi vida.", o: "Quédate un minuto en silencio delante de Dios, sin pedir nada, solo permaneciendo." },
      { t: "El escudo de la fe", p: "Efesios 6:16", v: "Sobre todo, tomad el escudo de la fe, con que podáis apagar todos los dardos de fuego del maligno.", r: "El escudo romano se empapaba en agua para apagar las flechas encendidas. La fe funciona igual: no evita que los dardos vengan, apaga su efecto. Pablo dice «sobre todo», porque es la pieza que protege a las demás. Los pensamientos de fuego llegan; la pregunta es qué levantas delante de ellos.", d: "Tomo el escudo de la fe y con él apago todo dardo de fuego del maligno.", o: "Identifica un pensamiento que te ataca de forma repetida y respóndele con una promesa de Dios." },
      { t: "Refugio seguro", p: "Salmos 91:1-2", v: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.", r: "Habitar es distinto de visitar. El salmo promete la sombra del Omnipotente a quien habita ahí, no a quien pasa de vez en cuando. Y fíjate en lo que sigue: «Diré yo a Jehová». El refugio se toma también con la boca, declarando de quién eres antes de que llegue la tormenta.", d: "Habito al abrigo del Altísimo; Él es mi esperanza y mi castillo, y en Él confío.", o: "Dile a Dios en voz alta: tú eres mi refugio. Repítelo hasta que tu corazón lo crea." },
      { t: "Paz en la tormenta", p: "Marcos 4:39", v: "Y levantándose, reprendió al viento, y dijo al mar: Calla, enmudece. Y cesó el viento, y se hizo grande bonanza.", r: "Los discípulos despertaron a Jesús reclamándole que no le importaba. Él no los regañó primero: calmó el viento. Nota que Jesús dormía en la misma barca y bajo la misma tormenta. Estar con Cristo no siempre significa que no habrá tormenta; significa que la tormenta no tiene la última palabra.", d: "Jesús está en mi barca. Él habla a mi tormenta y se hace grande bonanza.", o: "Dile a Dios cuál es la tormenta de hoy y pídele que hable a esa situación." },
      { t: "Cosas grandes y ocultas", p: "Jeremías 33:3", v: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.", r: "Es una invitación con una condición muy simple: clama. Dios promete responder y, además, enseñarte algo que no conoces. Orar no es solo pedir que cambien las circunstancias, es abrir la puerta a entender lo que no ves. Hay cosas que Dios solo le enseña a quien se toma el trabajo de preguntar.", d: "Clamo a Dios y Él me responde, y me enseña cosas grandes que yo no conozco.", o: "Hazle a Dios una pregunta sincera sobre tu vida y quédate un momento esperando en silencio." },
      { t: "La alegría del Señor es tu fuerza", p: "Nehemías 8:10", v: "No os entristezcáis, porque el gozo de Jehová es vuestra fuerza.", r: "El pueblo lloraba al oír la ley, y Nehemías los detiene. No les pide que ignoren su falta, les recuerda dónde está la fuerza. Y fíjate: no dice «tu alegría», dice «el gozo de Jehová». La fuerza no nace de que tú te sientas bien, sino de que Él se goza en ti.", d: "El gozo de Jehová es mi fuerza, aun en los días en que mis ánimos no alcanzan.", o: "Pide a Dios que te devuelva el gozo en un área donde has estado cumpliendo sin alegría." },
      { t: "Hijos de Dios", p: "1 Juan 3:1", v: "Mirad cuál amor nos ha dado el Padre, para que seamos llamados hijos de Dios.", r: "Juan no dice «mirad cuánto trabajamos», dice «mirad cuál amor nos ha dado». Ser llamado hijo no fue un logro tuyo, fue un regalo suyo. Y es un título presente, no una meta futura. Antes de pedirle algo hoy a Dios, recuerda desde dónde le hablas: como hijo, no como empleado.", d: "Soy hijo de Dios por su amor, no por mis méritos. Desde esa identidad vivo hoy.", o: "Habla hoy con Dios como hijo: sin fórmulas y sin méritos, como quien llega a casa." },
      { t: "Todo lo puedo en Cristo", p: "Filipenses 4:13", v: "Todo lo puedo en Cristo que me fortalece.", r: "Este versículo se cita mucho fuera de su contexto. Pablo lo escribe hablando de saber vivir con abundancia y con escasez. El «todo» no es todo lo que se te ocurra: es todo lo que Dios ponga delante, incluido lo difícil. La fuerza no es para conseguir más, es para sostenerte.", d: "Todo lo puedo en Cristo que me fortalece, tanto en la abundancia como en la escasez.", o: "Pide a Dios fuerza no para cambiar tu circunstancia, sino para vivirla con fidelidad." },
      { t: "Gracia abundante", p: "2 Corintios 12:9", v: "Bástate mi gracia; porque mi poder se perfecciona en la debilidad.", r: "Pablo pidió tres veces que le quitaran el aguijón y Dios le dijo que no. Pero no lo dejó solo: le dio algo distinto de la solución, le dio su gracia. Hay oraciones que Dios responde quitando el problema y otras sosteniéndote dentro de él. Las dos son respuestas.", d: "La gracia de Dios me basta, porque su poder se perfecciona justo en mi debilidad.", o: "Si hay algo que has pedido mucho y no cambia, pide hoy gracia para sostenerte en ello." },
      { t: "Guarda tu corazón", p: "Proverbios 4:23", v: "Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida.", r: "«Sobre toda cosa guardada» significa: si solo pudieras cuidar una cosa, que sea esta. El corazón aquí no es el sentimiento, es el centro desde donde decides. De él mana la vida, así que lo que entra ahí termina saliendo en tus palabras y en tus actos. Cuida la entrada y cuidarás el resto.", d: "Guardo mi corazón sobre toda cosa, porque de él mana el rumbo de mi vida.", o: "Pregúntale a Dios qué está entrando a tu corazón que necesita salir, y pídele limpieza." },
      { t: "Dios pelea por ti", p: "Éxodo 14:14", v: "Jehová peleará por vosotros, y vosotros estaréis tranquilos.", r: "El pueblo estaba entre el mar y el ejército, sin salida. La instrucción de Dios fue doble: Él pelea, ellos guardan silencio. Estar tranquilo cuando todo apura no es pasividad, es confianza. A veces el mayor acto de fe no es hacer algo, sino dejar de intentar resolverlo por tu cuenta.", d: "Jehová pelea por mí; hoy escojo estar tranquilo en lugar de resolverlo con mis fuerzas.", o: "Entrega a Dios una batalla que has estado peleando solo y quédate en silencio un momento." },
      { t: "La paciencia de la fe", p: "Santiago 1:3-4", v: "Sabiendo que la prueba de vuestra fe produce paciencia. Mas tenga la paciencia su obra completa.", r: "Santiago no dice que la prueba sea buena, dice que produce algo. Y luego pide algo difícil: dejar que la paciencia termine su obra. Nuestra tentación siempre es acortar el proceso, salir antes. Pero lo que Dios está formando en ti durante la espera no se consigue de ninguna otra manera.", d: "Dejo que la paciencia tenga su obra completa en mí; Dios está formando algo en esta espera.", o: "Pide a Dios que te muestre qué está formando en ti a través de lo que hoy te cuesta." },
      { t: "La herencia del creyente", p: "Romanos 8:17", v: "Y si hijos, también herederos; herederos de Dios y coherederos con Cristo.", r: "Pablo une dos palabras que no solemos juntar: herederos y coherederos con Cristo. Lo que te espera no es un premio menor por buen comportamiento, es participar de lo que le pertenece al Hijo. Si hoy te sientes pequeño, recuerda que tu identidad no se mide por tu situación sino por tu parentesco.", d: "Soy heredero de Dios y coheredero con Cristo; mi identidad no depende de mi situación.", o: "Agradece a Dios por la herencia que tienes en Cristo, aunque hoy no la sientas." },
      { t: "Caminar en amor", p: "Efesios 5:2", v: "Y andad en amor, como también Cristo nos amó, y se entregó a sí mismo por nosotros.", r: "El modelo no es un sentimiento, es una entrega: «como también Cristo nos amó, y se entregó». Andar en amor cuesta algo, siempre. Si el amor que practicas nunca te ha costado tiempo, orgullo o comodidad, quizá todavía no se parece al del versículo. Empieza hoy con una persona concreta.", d: "Ando en amor como Cristo me amó, dispuesto a entregar algo por los demás.", o: "Piensa en una persona con quien te cuesta ser amoroso y ora por ella antes de juzgarla." },
      { t: "Mirando al autor de la fe", p: "Hebreos 12:2", v: "Puestos los ojos en Jesús, el autor y consumador de la fe.", r: "Al cerrar el mes, el escritor no dice «mira cuánto avanzaste», dice «pon los ojos en Jesús». Él es el autor, quien la empezó, y el consumador, quien la termina. Tu fe no depende de que tú la sostengas hasta el final: depende de Quien se comprometió a completarla.", d: "Pongo mis ojos en Jesús, autor y consumador de mi fe; Él termina lo que empezó en mí.", o: "Repasa el mes con Dios: agradécele por lo que hizo y entrégale lo que quedó pendiente." }
    ]
  },
  {
    month: 2,
    name: "Febrero",
    theme: "Amor, Perdón y Familia",
    daysCount: 28,
    topics: [
      { t: "El verdadero amor", p: "1 Corintios 13:4", v: "El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece." },
      { t: "Dios es amor", p: "1 Juan 4:8", v: "El que no ama, no ha conocido a Dios; porque Dios es amor." },
      { t: "El poder del perdón", p: "Colosenses 3:13", v: "Soportándoos con paciencia los unos a los otros, y perdonándoos si alguno tuviere queja contra otro." },
      { t: "Amor en acción", p: "1 Juan 3:18", v: "Hijitos míos, no amemos de palabra ni de lengua, sino de hecho y en verdad." },
      { t: "Bendición para tu casa", p: "Josué 24:15", v: "Pero yo y mi casa serviremos a Jehová." },
      { t: "Unidad familiar", p: "Salmos 133:1", v: "¡Mirad cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía!" },
      { t: "Palabras dulces", p: "Proverbios 16:24", v: "Panal de miel son los dichos suaves; suavidad al alma y medicina para los huesos." },
      { t: "Perdonar setenta veces siete", p: "Mateo 18:22", v: "No te digo hasta siete, sino aun hasta setenta veces siete." },
      { t: "El amor cubre multitud de faltas", p: "1 Pedro 4:8", v: "Y ante todo, tened entre vosotros ferviente amor; porque el amor cubrirá multitud de pecados." },
      { t: "Paz en el hogar", p: "Proverbios 17:1", v: "Mejor es un bocado seco, y en paz, que casa llena de banquetes con contienda." },
      { t: "Instruye al niño", p: "Proverbios 22:6", v: "Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él." },
      { t: "Amor incondicional", p: "Romanos 5:8", v: "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros." },
      { t: "La bondad de Dios", p: "Salmos 103:8", v: "Misericordioso y clemente es Jehová; lento para la ira, y grande en misericordia." },
      { t: "Sanando heridas del corazón", p: "Salmos 147:3", v: "Él sana a los quebrantados de corazón, y venda sus heridas." },
      { t: "Honra a tus padres", p: "Efesios 6:2-3", v: "Honra a tu padre y a tu madre, que es el primer mandamiento con promesa; para que te vaya bien." },
      { t: "Cordón de tres dobleces", p: "Eclesiastés 4:12", v: "Y si alguno prevaleciere contra uno, dos le resistirán; y cordón de tres dobleces no se rompe pronto." },
      { t: "La compasión de Jesús", p: "Mateo 9:36", v: "Y al ver las multitudes, tuvo compasión de ellas; porque estaban desamparadas y dispersas." },
      { t: "Libres de amargura", p: "Efesios 4:31-32", v: "Quítense de vosotros toda amargura, enojo, ira, gritería y maledicencia... Antes sed benignos unos con otros." },
      { t: "Vivir en armonía", p: "Romanos 12:18", v: "Si es posible, en cuanto dependa de vosotros, estad en paz con todos los hombres." },
      { t: "Un corazón agradecido", p: "1 Tesalonicenses 5:18", v: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús." },
      { t: "Gracia para los humildes", p: "Santiago 4:6", v: "Dios resiste a los soberbios, y da gracia a los humildes." },
      { t: "La paciencia en las relaciones", p: "Efesios 4:2", v: "Con toda humildad y mansedumbre, soportándoos con paciencia los unos a los otros en amor." },
      { t: "Amar a los que te rodean", p: "Marcos 12:31", v: "Amarás a tu prójimo como a ti mismo. No hay otro mandamiento mayor que éstos." },
      { t: "La fidelidad de Dios con las generaciones", p: "Salmos 100:5", v: "Porque Jehová es bueno; para siempre es su misericordia, y su verdad por todas las generaciones." },
      { t: "Edificar y no destruir", p: "1 Tesalonicenses 5:11", v: "Por lo cual, animaos unos a otros, y edificaos unos a otros, así como lo hacéis." },
      { t: "Paz interior que contagia", p: "Juan 14:27", v: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón." },
      { t: "Servir con alegría", p: "Gálatas 5:13", v: "Servíos por amor los unos a los otros." },
      { t: "El mayor de todos los dones", p: "1 Corintios 13:13", v: "Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor." }
    ]
  },
  {
    month: 3,
    name: "Marzo",
    theme: "Esperanza, Sanidad y Restauración",
    daysCount: 31,
    topics: [
      { t: "El Señor tu sanador", p: "Éxodo 15:26", v: "Porque yo soy Jehová tu sanador." },
      { t: "Por sus llagas fuimos sanados", p: "Isaías 53:5", v: "Mas él herido fue por nuestras rebeliones, molido por nuestros pecados; y por su llaga fuimos nosotros curados." },
      { t: "Esperanza viva", p: "1 Pedro 1:3", v: "Nos hizo renacer para una esperanza viva, por la resurrección de Jesucristo de los muertos." },
      { t: "Restauración del alma", p: "Salmos 23:3", v: "Confortará mi alma; me guiará por sendas de justicia por amor de su nombre." },
      { t: "El gozo que restaura", p: "Salmos 30:5", v: "Porque por un momento será su ira, pero su favor dura toda la vida. Por la noche durará el lloro, y a la mañana vendrá la alegría." },
      { t: "Sanidad integral", p: "3 Juan 1:2", v: "Amado, yo deseo que tú seas prosperado en todas las cosas, y que tengas salud, así como prospera tu alma." },
      { t: "Dios renueva tus fuerzas", p: "Isaías 40:31", v: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas." },
      { t: "La oración de fe sanará", p: "Santiago 5:15", v: "Y la oración de fe salvará al enfermo, y el Señor lo levantará." },
      { t: "Un espíritu alegre", p: "Proverbios 17:22", v: "El corazón alegre constituye buen remedio; mas el espíritu triste seca los huesos." },
      { t: "Esperanza que no avergüenza", p: "Romanos 5:5", v: "Y la esperanza no avergüenza; porque el amor de Dios ha sido derramado en nuestros corazones." },
      { t: "Levántate y resplandece", p: "Isaías 60:1", v: "Levántate, resplandece; porque ha venido tu luz, y la gloria de Jehová ha nacido sobre ti." },
      { t: "Dios enjugará toda lágrima", p: "Apocalipsis 21:4", v: "Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto." },
      { t: "Confianza en medio del dolor", p: "Salmos 46:1", v: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones." },
      { t: "El alfarero divino", p: "Jeremías 18:6", v: "Como el barro en la mano del alfarero, así sois vosotros en mi mano." },
      { t: "Paz que guarda tus pensamientos", p: "Filipenses 4:7", v: "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones." },
      { t: "No temas, cree solamente", p: "Marcos 5:36", v: "Pero Jesús, oyendo lo que se decía, dijo al principal de la sinagoga: No temas, cree solamente." },
      { t: "Ríos de agua viva", p: "Juan 7:38", v: "El que cree en mí, como dice la Escritura, de su interior correrán ríos de agua viva." },
      { t: "Belleza en lugar de cenizas", p: "Isaías 61:3", v: "A ordenar que a los afligidos de Sion se les dé gloria en lugar de ceniza, óleo de gozo en lugar de luto." },
      { t: "Dios escucha tu lamento", p: "Salmos 6:9", v: "Jehová ha oído mi ruego; ha recibido Jehová mi oración." },
      { t: "Un futuro lleno de esperanza", p: "Proverbios 23:18", v: "Porque ciertamente hay fin, y tu esperanza no será cortada." },
      { t: "Jesús sana las dolencias", p: "Mateo 8:17", v: "Él mismo tomó nuestras enfermedades, y llevó nuestras dolencias." },
      { t: "Bajo sus alas", p: "Salmos 91:4", v: "Con sus plumas te cubrirá, y debajo de sus alas estarás seguro; escudo y adarga es su verdad." },
      { t: "La paciencia en la aflicción", p: "Romanos 12:12", v: "Gozosos en la esperanza; sufridos en la tribulación; constantes en la oración." },
      { t: "Consuelo en toda prueba", p: "2 Corintios 1:3-4", v: "El Padre de misericordias y Dios de toda consolación, el cual nos consuela en todas nuestras tribulaciones." },
      { t: "Renovados de día en día", p: "2 Corintios 4:16", v: "Por tanto, no desmayamos; antes aunque este nuestro hombre exterior se va desgastando, el interior no obstante se renueva de día en día." },
      { t: "El toque de Jesús", p: "Lucas 8:48", v: "Y él le dijo: Hija, tu fe te ha salvado; ve en paz." },
      { t: "La roca más alta", p: "Salmos 61:2", v: "Desde el cabo de la tierra clamaré a ti, cuando mi corazón desmayare. Guíame a la roca que es más alta que yo." },
      { t: "Sanidad para las naciones", p: "Malaquías 4:2", v: "Mas a vosotros los que teméis mi nombre, nacerá el Sol de justicia, y en sus alas traerá salvación." },
      { t: "Dios nunca llega tarde", p: "Habacuc 2:3", v: "Aunque la visión tardará aún por un tiempo... ciertamente vendrá, no tardará." },
      { t: "Firmeza en la promesa", p: "Hebreos 10:23", v: "Mantengamos firme, sin fluctuar, la profesión de nuestra esperanza, porque fiel es el que prometió." },
      { t: "Alabanza por la victoria", p: "Salmos 103:2-3", v: "Bendice, alma mía, a Jehová, y no olvides ninguno de sus beneficios. Él es quien perdona todas tus iniquidades, el que sana todas tus dolencias." }
    ]
  },
  {
    month: 4,
    name: "Abril",
    theme: "Gracia, Cruz y Redención",
    daysCount: 30,
    topics: [
      { t: "El mayor sacrificio", p: "Juan 3:16", v: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna." },
      { t: "Salvos por gracia", p: "Efesios 2:8-9", v: "Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe." },
      { t: "La tumba vacía", p: "Lucas 24:6", v: "No está aquí, sino que ha resucitado." },
      { t: "Consumado es", p: "Juan 19:30", v: "Cuando Jesús tomó el vinagre, dijo: Consumado es. Y habiendo inclinado la cabeza, entregó el espíritu." },
      { t: "Justificados por la fe", p: "Romanos 5:1", v: "Justificados, pues, por la fe, tenemos paz para con Dios por medio de nuestro Señor Jesucristo." },
      { t: "Libres de condenación", p: "Romanos 8:1", v: "Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús." },
      { t: "El poder de la resurrección", p: "Filipenses 3:10", v: "A fin de conocerle, y el poder de su resurrección, y la participación de sus padecimientos." },
      { t: "Limpio de todo pecado", p: "1 Juan 1:7", v: "La sangre de Jesucristo su Hijo nos limpia de todo pecado." },
      { t: "El buen pastor", p: "Juan 10:11", v: "Yo soy el buen pastor; el buen pastor su vida da por las ovejas." },
      { t: "Vida en abundancia", p: "Juan 10:10", v: "Yo he venido para que tengan vida, y para que la tengan en abundancia." },
      { t: "La cruz como victoria", p: "Colosenses 2:15", v: "Y despojando a los principados y a las potestades, los exhibió públicamente, triunfando sobre ellos en la cruz." },
      { t: "Embajadores de Cristo", p: "2 Corintios 5:20", v: "Así que, somos embajadores en nombre de Cristo, como si Dios rogase por medio de nosotros." },
      { t: "Amigos de Dios", p: "Juan 15:15", v: "Ya no os llamaré siervos... pero os he llamado amigos, porque todas las cosas que oí de mi Padre, os las he dado a conocer." },
      { t: "El velo rasgado", p: "Hebreos 10:19-20", v: "Teniendo libertad para entrar en el Lugar Santísimo por la sangre de Jesucristo, por el camino nuevo y vivo." },
      { t: "Gracia sobre gracia", p: "Juan 1:16", v: "Porque de su plenitud tomamos todos, y gracia sobre gracia." },
      { t: "El Cordero de Dios", p: "Juan 1:29", v: "He aquí el Cordero de Dios, que quita el pecado del mundo." },
      { t: "Vencedores en Cristo", p: "Romanos 8:37", v: "Antes, en todas estas cosas somos más que vencedores por medio de aquel que nos amó." },
      { t: "Comprados por precio", p: "1 Corintios 6:20", v: "Porque habéis sido comprados por precio; glorificad, pues, a Dios en vuestro cuerpo y en vuestro espíritu." },
      { t: "El camino, la verdad y la vida", p: "Juan 14:6", v: "Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí." },
      { t: "Gracia para servir", p: "1 Pedro 4:10", v: "Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios." },
      { t: "El trono de la gracia", p: "Hebreos 4:16", v: "Acerquémonos, pues, confiadamente al trono de la gracia, para alcanzar misericordia y hallar gracia para el oportuno socorro." },
      { t: "El amor manifestado", p: "1 Juan 4:10", v: "En esto consiste el amor: no en que nosotros hayamos amado a Dios, sino en que él nos amó a nosotros." },
      { t: "La luz del mundo", p: "Juan 8:12", v: "Yo soy la luz del mundo; el que me sigue, no andará en tinieblas, sino que tendrá la luz de la vida." },
      { t: "Sellados por el Espíritu", p: "Efesios 1:13", v: "Fuisteis sellados con el Espíritu Santo de la promesa." },
      { t: "Libertad gloriosa", p: "Gálatas 5:1", v: "Estad, pues, firmes en la libertad con que Cristo nos hizo libres." },
      { t: "La corona de la vida", p: "Santiago 1:12", v: "Bienaventurado el varón que soporta la tentación; porque cuando haya resistido la prueba, recibirá la corona de vida." },
      { t: "La paz de Cristo gobierne", p: "Colosenses 3:15", v: "Y la paz de Dios gobierne en vuestros corazones, a la que asimismo fuisteis llamados en un solo cuerpo; y sed agradecidos." },
      { t: "Permanecer en su amor", p: "Juan 15:9", v: "Como el Padre me ha amado, así también yo os he amado; permaneced en mi amor." },
      { t: "Cristo vive en mí", p: "Gálatas 2:20", v: "Con Cristo estoy juntamente crucificado, y ya no vivo yo, mas vive Cristo en mí." },
      { t: "La bendición de creer", p: "Juan 20:29", v: "Bienaventurados los que no vieron, y creyeron." }
    ]
  },
  {
    month: 5,
    name: "Mayo",
    theme: "Sabiduría, Trabajo y Propósito",
    daysCount: 31,
    topics: [
      { t: "El principio de la sabiduría", p: "Proverbios 9:10", v: "El temor de Jehová es el principio de la sabiduría, y el conocimiento del Santísimo es la inteligencia." },
      { t: "Trabajar para el Señor", p: "Colosenses 3:23", v: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres." },
      { t: "Pedir sabiduría a Dios", p: "Santiago 1:5", v: "Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche." },
      { t: "Manos diligentes", p: "Proverbios 10:4", v: "La mano negligente empobrece; mas la mano de los diligentes enriquece." },
      { t: "Encomienda tus obras", p: "Proverbios 16:3", v: "Encomienda a Jehová tus obras, y tus pensamientos serán afirmados." },
      { t: "Planes con consejo", p: "Proverbios 15:22", v: "Los pensamientos son frustrados donde no hay consejo; mas en la multitud de consejeros se afirman." },
      { t: "El valor de la integridad", p: "Proverbios 11:3", v: "La integridad de los rectos los encaminará; pero destruirá a los pecadores la perversidad de ellos." },
      { t: "Lámpara a tus pasos", p: "Salmos 37:23", v: "Por Jehová son ordenados los pasos del hombre, y él aprueba su camino." },
      { t: "Honrar a Dios con tus bienes", p: "Proverbios 3:9-10", v: "Honra a Jehová con tus bienes, y con las primicias de todos tus frutos; y serán llenos tus graneros con abundancia." },
      { t: "La recompensa de la humildad", p: "Proverbios 22:4", v: "Riquezas, honra y vida son la remuneración de la humildad y del temor de Jehová." },
      { t: "Excelencia en todo", p: "Eclesiastés 9:10", v: "Todo lo que te viniere a la mano para hacer, hazlo según tus fuerzas." },
      { t: "El poder de la prudencia", p: "Proverbios 14:15", v: "El simple todo lo cree; mas el avisado mira bien sus pasos." },
      { t: "Sabiduría de lo alto", p: "Santiago 3:17", v: "Pero la sabiduría que es de lo alto es primeramente pura, después pacífica, amable, benigna, llena de misericordia." },
      { t: "Cuidar las palabras", p: "Proverbios 18:21", v: "La muerte y la vida están en poder de la lengua, y el que la ama comerá de sus frutos." },
      { t: "Administrar con fidelidad", p: "Lucas 16:10", v: "El que es fiel en lo muy poco, también en lo más es fiel; y el que en lo muy poco es injusto, también en lo más es injusto." },
      { t: "Buscar la dirección de Dios", p: "Salmos 143:8", v: "Hazme oír por la mañana tu misericordia, porque en ti he confiado; hazme saber el camino por donde ande." },
      { t: "El trabajo honesto bendice", p: "1 Tesalonicenses 4:11-12", v: "Y que procuréis tener quietud, y hacer vuestros propios negocios, y trabajar con vuestras manos, a fin de que os conduzcáis honradamente para con los de afuera." },
      { t: "No afanarse por riquezas", p: "1 Timoteo 6:6", v: "Pero gran ganancia es la piedad acompañada de contentamiento." },
      { t: "Sembradores de paz", p: "Santiago 3:18", v: "Y el fruto de justicia se siembra en paz para aquellos que hacen la paz." },
      { t: "El favor de Dios abre puertas", p: "Salmos 90:17", v: "Sea la luz de Jehová nuestro Dios sobre nosotros, y la obra de nuestras manos confirma sobre nosotros." },
      { t: "Creatividad inspirada por Dios", p: "Éxodo 31:3", v: "Y lo he llenado del Espíritu de Dios, en sabiduría y en inteligencia, en ciencia y en todo arte." },
      { t: "Paciencia para cosechar", p: "Santiago 5:7", v: "Mirad cómo el labrador espera el precioso fruto de la tierra, aguardando con paciencia." },
      { t: "Ser luz en tu lugar de trabajo", p: "Mateo 5:16", v: "Así alumbre vuestra luz delante de los hombres, para que vean vuestras buenas obras, y glorifiquen a vuestro Padre." },
      { t: "Liderazgo de servicio", p: "Marcos 10:45", v: "Porque el Hijo del Hombre no vino para ser servido, sino para servir, y para dar su vida en rescate por muchos." },
      { t: "Guardar el testimonio", p: "Tito 2:7", v: "Presentándote tú en todo como ejemplo de buenas obras; en la enseñanza mostrando integridad, seriedad." },
      { t: "Dios te da poder para hacer bienes", p: "Deuteronomio 8:18", v: "Sino acuérdate de Jehová tu Dios, porque él te da el poder para hacer las riquezas." },
      { t: "Caminar con los sabios", p: "Proverbios 13:20", v: "El que anda con sabios, sabio será; mas el que se junta con necios será quebrantado." },
      { t: "La bendición de Jehová enriquece", p: "Proverbios 10:22", v: "La bendición de Jehová es la que enriquece, y no añade tristeza con ella." },
      { t: "Constancia y dedicación", p: "Proverbios 21:5", v: "Los pensamientos del diligente ciertamente tienden a la abundancia; mas todo el que se apresura alocadamente, de cierto va a la pobreza." },
      { t: "Confiar los resultados al Señor", p: "Salmos 127:1", v: "Si Jehová no edificare la casa, en vano trabajan los que la edifican." },
      { t: "Vivir con propósito claro", p: "1 Corintios 9:26", v: "Así que, yo de esta manera corro, no como a la ventura; de esta manera peleo, no como quien golpea el aire." }
    ]
  },
  {
    month: 6,
    name: "Junio",
    theme: "Paz, Confianza y Victoria Espiritual",
    daysCount: 30,
    topics: [
      { t: "Paz en medio del caos", p: "Juan 16:33", v: "Estas cosas os he hablado para que en mí tengáis paz. En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo." },
      { t: "Bajo la sombra del Omnipotente", p: "Salmos 91:1-4", v: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente... Con sus plumas te cubrirá." },
      { t: "No temerás a nada", p: "Salmos 27:1", v: "Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida; ¿de quién he de atemorizarme?" },
      { t: "La armadura de Dios", p: "Efesios 6:11", v: "Vestíos de toda la armadura de Dios, para que podáis estar firmes contra las asechanzas del diablo." },
      { t: "El Señor es mi pastor", p: "Salmos 23:1", v: "Jehová es mi pastor; nada me faltará." },
      { t: "Descanso para el alma", p: "Mateo 11:28", v: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
      { t: "Espíritu de poder y amor", p: "2 Timoteo 1:7", v: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio." },
      { t: "La paz de Dios que guarda", p: "Isaías 26:3", v: "Tú guardarás en completa paz a aquel cuyo pensamiento en ti persevera; porque en ti ha confiado." },
      { t: "Victoria sobre el enemigo", p: "Lucas 10:19", v: "He aquí os doy potestad de hollar serpientes y escorpiones, y sobre toda fuerza del enemigo, y nada os dañará." },
      { t: "Ninguna arma prosperará", p: "Isaías 54:17", v: "Ninguna arma forjada contra ti prosperará, y condenarás toda lengua que se levante contra ti en juicio." },
      { t: "Callar y esperar en Dios", p: "Salmos 37:7", v: "Guarda silencio ante Jehová, y espera en él. No te alteres con motivo del que prospera en su camino." },
      { t: "Dios es nuestro refugio", p: "Salmos 62:8", v: "Esperad en él en todo tiempo, oh pueblos; derramad delante de él vuestro corazón; Dios es nuestro refugio." },
      { t: "El poder del nombre de Jesús", p: "Proverbios 18:10", v: "Torre fuerte es el nombre de Jehová; a él correrá el justo, y será levantado." },
      { t: "Firmeza en la prueba", p: "1 Corintios 15:58", v: "Así que, hermanos míos amados, estad firmes y constantes, creciendo en la obra del Señor siempre." },
      { t: "La victoria que vence al mundo", p: "1 Juan 5:4", v: "Porque todo lo que es nacido de Dios vence al mundo; y esta es la victoria que ha vencido al mundo, nuestra fe." },
      { t: "Tranquilidad al dormir", p: "Salmos 4:8", v: "En paz me acostaré, y asimismo dormiré; porque solo tú, Jehová, me haces vivir confiado." },
      { t: "Ángeles a tu alrededor", p: "Salmos 34:7", v: "El ángel de Jehová acampa alrededor de los que le temen, y los defiende." },
      { t: "No desmayes", p: "Isaías 41:10", v: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré." },
      { t: "La espada del Espíritu", p: "Hebreos 4:12", v: "Porque la palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos." },
      { t: "Cantar en la noche", p: "Salmos 42:8", v: "Pero de día mandará Jehová su misericordia, y de noche su cántico estará conmigo, y mi oración al Dios de mi vida." },
      { t: "El Señor pelea por ti", p: "Deuteronomio 20:4", v: "Porque Jehová vuestro Dios va con vosotros, para pelear por vosotros contra vuestros enemigos, para salvaros." },
      { t: "Vencer con el bien", p: "Romanos 12:21", v: "No seas vencido de lo malo, sino vence con el bien el mal." },
      { t: "Confianza inquebrantable", p: "Salmos 125:1", v: "Los que confían en Jehová son como el monte de Sion, que no se mueve, sino que permanece para siempre." },
      { t: "Pronto auxilio", p: "Salmos 121:1-2", v: "Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra." },
      { t: "Libres del afán", p: "1 Pedro 5:7", v: "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros." },
      { t: "La roca inconmovible", p: "Mateo 7:24-25", v: "Cualquiera, pues, que me oye estas palabras, y las hace, le compararé a un hombre prudente, que edificó su casa sobre la roca. Descendió lluvia, y vinieron ríos, y soplaron vientos, y golpearon contra aquella casa; y no cayó, porque estaba fundada sobre la roca." },
      { t: "Victoria a través de la alabanza", p: "2 Crónicas 20:22", v: "Y cuando comenzaron a entonar cantos de alabanza, Jehová puso contra los hijos de Amón las emboscadas." },
      { t: "Dios te sostiene con su diestra", p: "Salmos 63:8", v: "Está mi alma apegada a ti; tu diestra me ha sostenido." },
      { t: "Paz como un río", p: "Isaías 66:12", v: "Porque así dice Jehová: He aquí que yo extiendo sobre ella paz como un río." },
      { t: "Fiel es Dios", p: "1 Corintios 10:13", v: "No os ha sobrevenido ninguna tentación que no sea humana; pero fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir." }
    ]
  },
  {
    month: 7,
    name: "Julio",
    theme: "Fortaleza, Resiliencia y Crecimiento",
    daysCount: 31,
    topics: [
      { t: "Fuerzas renovadas", p: "Salmos 84:7", v: "Irán de poder en poder; verán a Dios en Sion." },
      { t: "El gozo que fortalece", p: "Habacuc 3:19", v: "Jehová el Señor es mi fortaleza, el cual hace mis pies como de ciervas, y en mis alturas me hace andar." },
      { t: "Crecimiento espiritual", p: "2 Pedro 3:18", v: "Antes bien, creced en la gracia y el conocimiento de nuestro Señor y Salvador Jesucristo." },
      { t: "Perseverar hasta el fin", p: "Mateo 24:13", v: "Mas el que persevere hasta el fin, éste será salvo." },
      { t: "Firme como un roble", p: "Salmos 1:3", v: "Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo, y su hoja no cae; y todo lo que hace, prosperará." },
      { t: "Vigor en la vejez", p: "Salmos 92:14", v: "Aun en la vejez fructificarán; estarán vigorosos y verdes." },
      { t: "Poder para resistir", p: "Santiago 4:7", v: "Someteos, pues, a Dios; resistid al diablo, y huirá de vosotros." },
      { t: "La gloria venidera", p: "Romanos 8:18", v: "Pues tengo por cierto que las aflicciones del tiempo presente no son comparables con la gloria venidera." },
      { t: "Fortalecidos en el Señor", p: "Efesios 6:10", v: "Por lo demás, hermanos míos, fortaleceos en el Señor, y en el poder de su fuerza." },
      { t: "Avanzar sin mirar atrás", p: "Filipenses 3:13-14", v: "Olvidando ciertamente lo que queda atrás, y extendiéndome a lo que está delante, prosigo a la meta." },
      { t: "Raíces profundas", p: "Colosenses 2:7", v: "Arraigados y sobreedificados en él, y confirmados en la fe, así como habéis sido enseñados." },
      { t: "El Señor es mi fortaleza", p: "Salmos 28:7", v: "Jehová es mi fortaleza y mi escudo; en él confió mi corazón, y fui ayudado, por lo que se gozó mi corazón." },
      { t: "Fuego refinador", p: "Zacarías 13:9", v: "Y los fundiré como se funde la plata, y los probaré como se prueba el oro. Él invocará mi nombre, y yo le oiré." },
      { t: "Poder para proclamar", p: "Hechos 1:8", v: "Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos." },
      { t: "No cansarse de orar", p: "Lucas 18:1", v: "También les refirió Jesús una parábola sobre la necesidad de orar siempre, y no desmayar." },
      { t: "La paciencia engendra carácter", p: "Romanos 5:3-4", v: "Y no sólo esto, sino que también nos gloriamos en las tribulaciones, sabiendo que la tribulación produce paciencia; y la paciencia, prueba; y la prueba, esperanza." },
      { t: "El socorro de lo alto", p: "Salmos 20:2", v: "Te envíe ayuda desde el santuario, y desde Sion te sostenga." },
      { t: "Levantarse tras la caída", p: "Proverbios 24:16", v: "Porque siete veces cae el justo, y vuelve a levantarse; mas los impíos caerán en el mal." },
      { t: "Caminar por el fuego sin quemarse", p: "Isaías 43:2", v: "Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán. Cuando pases por el fuego, no te quemarás." },
      { t: "La sabiduría de aprender", p: "Proverbios 1:5", v: "Oirá el sabio, y aumentará el saber, y el entendido adquirirá consejo." },
      { t: "Fidelidad en lo invisible", p: "Mateo 6:6", v: "Mas tú, cuando ores, entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en secreto." },
      { t: "La luz vence a las tinieblas", p: "Juan 1:5", v: "La luz en las tinieblas resplandece, y las tinieblas no prevalecieron contra ella." },
      { t: "Sostén divino", p: "Salmos 55:22", v: "Echa sobre Jehová tu carga, y él te sustentará; no dejará para siempre caído al justo." },
      { t: "Ser valientes en la fe", p: "1 Corintios 16:13", v: "Velad, estad firmes en la fe; portaos varonilmente, y esforzaos." },
      { t: "La corona incorruptible", p: "1 Corintios 9:25", v: "Ellos, a la verdad, para recibir una corona corruptible, pero nosotros, una incorruptible." },
      { t: "El poder del Espíritu en ti", p: "Romanos 8:11", v: "Y si el Espíritu de aquel que levantó de los muertos a Jesús mora en vosotros, el que levantó de los muertos a Cristo vivificará también vuestros cuerpos." },
      { t: "Gracia para cada estación", p: "Eclesiastés 3:1", v: "Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora." },
      { t: "Caminar en integridad", p: "Salmos 15:1-2", v: "Jehová, ¿quién habitará en tu tabernáculo? El que anda en integridad y hace justicia." },
      { t: "Dios nunca te dejará", p: "Hebreos 13:5", v: "No te desampararé, ni te dejaré." },
      { t: "Victoria a través del amor", p: "Romanos 8:38-39", v: "Por lo cual estoy seguro de que ni la muerte, ni la vida... nos podrá separar del amor de Dios." },
      { t: "Completará su obra en ti", p: "Filipenses 1:6", v: "Estando persuadido de esto, que el que comenzó en vosotros la buena obra, la perfeccionará hasta el día de Jesucristo." }
    ]
  },
  {
    month: 8,
    name: "Agosto",
    theme: "Propósito, Visión y Liderazgo",
    daysCount: 31,
    topics: [
      { t: "Llamados con propósito", p: "Romanos 8:28", v: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados." },
      { t: "Obra maestra de Dios", p: "Efesios 2:10", v: "Porque somos hechura suya, creados en Cristo Jesús para buenas obras, las cuales Dios preparó de antemano." },
      { t: "Escribir la visión", p: "Habacuc 2:2", v: "Y Jehová me respondió, y dijo: Escribe la visión, y declárala en tablas, para que corra el que leyere en ella." },
      { t: "Sal de la tierra", p: "Mateo 5:13", v: "Vosotros sois la sal de la tierra; pero si la sal se desvaneciere, ¿con qué será salada?" },
      { t: "Influencia positiva", p: "Proverbios 27:17", v: "Hierro con hierro se aguza; y así el hombre aguza el rostro de su amigo." },
      { t: "Liderar con el ejemplo", p: "1 Timoteo 4:12", v: "Ninguno tenga en poco tu juventud, sino sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza." },
      { t: "La gran comisión", p: "Mateo 28:19-20", v: "Por tanto, id, y haced discípulos a todas las naciones... y he aquí yo estoy con vosotros todos los días." },
      { t: "Correr con perseverancia", p: "Hebreos 12:1", v: "Despojémonos de todo peso y del pecado que nos asedia, y corramos con paciencia la carrera que tenemos por delante." },
      { t: "Dones puestos al servicio", p: "Romanos 12:6", v: "De manera que, teniendo diferentes dones, según la gracia que nos es dada, si el de profecía, úsese conforme a la medida de la fe." },
      { t: "Un corazón para servir", p: "Mateo 20:26-28", v: "El que quiera hacerse grande entre vosotros será vuestro servidor... como el Hijo del Hombre." },
      { t: "La voz del Pastor", p: "Juan 10:27", v: "Mis ovejas oyen mi voz, y yo las conozco, y me siguen." },
      { t: "No tener miedo de soñar", p: "Efesios 3:20", v: "Y a Aquel que es poderoso para hacer todas las cosas mucho más abundantemente de lo que pedimos o entendemos." },
      { t: "Pasos firmes hacia la meta", p: "Proverbios 4:26", v: "Examina la senda de tus pies, y todos tus caminos sean rectos." },
      { t: "Brillar en la oscuridad", p: "Filipenses 2:15", v: "Para que seáis irreprensibles y sencillos, hijos de Dios sin mancha en medio de una generación maligna y perversa, en medio de la cual resplandecéis como luminares en el mundo." },
      { t: "Unción para transformar", p: "Isaías 61:1", v: "El Espíritu de Jehová el Señor está sobre mí, porque me ungió Jehová; me ha enviado a predicar buenas nuevas." },
      { t: "Poner a Dios primero", p: "Salmos 37:4", v: "Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón." },
      { t: "Celo por la casa de Dios", p: "Salmos 69:9", v: "Porque me consumió el celo de tu casa." },
      { t: "Sabiduría para edificar", p: "Proverbios 14:1", v: "La mujer sabia edifica su casa; mas la necia con sus manos la derriba." },
      { t: "El valor del consejo sabio", p: "Proverbios 11:14", v: "Donde no hay dirección sabia, caerá el pueblo; mas en la multitud de consejeros hay seguridad." },
      { t: "Vivir para la gloria de Dios", p: "1 Corintios 10:31", v: "Si, pues, coméis o bebéis, o hacéis otra cosa, hacedlo todo para la gloria de Dios." },
      { t: "Diligencia que honra", p: "Proverbios 22:29", v: "¿Has visto hombre solícito en su trabajo? Delante de los reyes estará; no estará delante de los de baja condición." },
      { t: "Dios te equipa para su obra", p: "Hebreos 13:21", v: "Os haga aptos en toda obra buena para que hagáis su voluntad, haciendo él en vosotros lo que es agradable delante de él." },
      { t: "Fieles en lo ajeno", p: "Lucas 16:12", v: "Y si en lo ajeno no fuisteis fieles, ¿quién os dará lo que es vuestro?" },
      { t: "Generosidad que trasciende", p: "2 Corintios 9:7", v: "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre." },
      { t: "El poder del testimonio", p: "Apocalipsis 12:11", v: "Y ellos le han vencido por medio de la sangre del Cordero y de la palabra del testimonio de ellos." },
      { t: "Guiados por el Espíritu", p: "Gálatas 5:25", v: "Si vivimos por el Espíritu, andemos también por el Espíritu." },
      { t: "Construir sobre roca firme", p: "1 Corintios 3:11", v: "Porque nadie puede poner otro fundamento que el que está puesto, el cual es Jesucristo." },
      { t: "Visión que trasciende generaciones", p: "Salmos 78:4", v: "No las encubriremos a sus hijos, contando a la generación venidera las alabanzas de Jehová." },
      { t: "El fruto que permanece", p: "Juan 15:16", v: "No me elegisteis vosotros a mí, sino que yo os elegí a vosotros, y os he puesto para que vayáis y llevéis fruto, y vuestro fruto permanezca." },
      { t: "Valentía para decidir", p: "1 Reyes 18:21", v: "¿Hasta cuándo claudicaréis vosotros entre dos pensamientos? Si Jehová es Dios, seguidle." },
      { t: "La recompensa eterna", p: "Colosenses 3:24", v: "Sabiendo que del Señor recibiréis la recompensa de la herencia, porque a Cristo el Señor servís." }
    ]
  },
  {
    month: 9,
    name: "Septiembre",
    theme: "El Poder y la Disciplina de la Oración",
    daysCount: 30,
    topics: [
      { t: "Nunca estás demasiado ocupado para orar", p: "1 Tesalonicenses 5:17", v: "Orad sin cesar." },
      { t: "La oración eficaz del justo", p: "Santiago 5:16", v: "Confesaos vuestras ofensas unos a otros, y orad unos por otros, para que seáis sanados. La oración eficaz del justo puede mucho." },
      { t: "Pedid y se os dará", p: "Mateo 7:7-8", v: "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá." },
      { t: "Orar de madrugada", p: "Marcos 1:35", v: "Levantándose muy de mañana, siendo aún muy oscuro, salió y se fue a un lugar desierto, y allí oraba." },
      { t: "Clamar con fe", p: "Salmos 145:18", v: "Cercano está Jehová a todos los que le invocan, a todos los que le invocan de veras." },
      { t: "El aposento secreto", p: "Mateo 6:6", v: "Mas tú, cuando ores, entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en secreto; y tu Padre que ve en lo secreto te recompensará en público." },
      { t: "Orar en el Espíritu", p: "Judas 1:20", v: "Pero vosotros, amados, edificándoos sobre vuestra santísima fe, orando en el Espíritu Santo." },
      { t: "Interceder por otros", p: "1 Timoteo 2:1", v: "Exhorto ante todo, a que se hagan rogativas, oraciones, peticiones y acciones de gracias, por todos los hombres." },
      { t: "La oración rompe cadenas", p: "Hechos 16:25-26", v: "Pero a medianoche, orando Pablo y Silas, cantaban himnos a Dios... y al instante se abrieron todas las puertas." },
      { t: "Dios escucha el suspiro", p: "Salmos 38:9", v: "Señor, delante de ti están todos mis deseos, y mi suspiro no te es oculto." },
      { t: "Perseverar en la súplica", p: "Colosenses 4:2", v: "Perseverad en la oración, velando en ella con acción de gracias." },
      { t: "El modelo de Jesús", p: "Mateo 6:9-10", v: "Vosotros, pues, oraréis así: Padre nuestro que estás en los cielos, santificado sea tu nombre. Venga tu reino." },
      { t: "Orar por los gobernantes", p: "1 Timoteo 2:2", v: "Por los reyes y por todos los que están en eminencia, para que vivamos quieta y reposadamente." },
      { t: "El incienso de la oración", p: "Salmos 141:2", v: "Suba mi oración delante de ti como el incienso, el don de mis manos como la ofrenda de la tarde." },
      { t: "El poder del acuerdo", p: "Mateo 18:19", v: "Otra vez os digo, que si dos de vosotros se pusieren de acuerdo en la tierra acerca de cualquiera cosa que pidieren, les será hecho por mi Padre." },
      { t: "Orar con motivos puros", p: "Santiago 4:3", v: "Pedís, y no recibís, porque pedís mal, para gastar en vuestros deleites." },
      { t: "La voz de la alabanza", p: "Salmos 66:19-20", v: "Mas ciertamente me escuchó Dios; atendió a la voz de mi súplica. Bendito sea Dios, que no desechó mi oración." },
      { t: "Interceder por los enfermos", p: "Santiago 5:14", v: "¿Está alguno enfermo entre vosotros? Llame a los ancianos de la iglesia, y oren por él, ungiéndole con aceite." },
      { t: "Orar por tus enemigos", p: "Mateo 5:44", v: "Pero yo os digo: Amad a vuestros enemigos, bendecid a los que os maldicen, haced bien a los que os aborrecen, y orad por los que os ultrajan." },
      { t: "Oración y ayuno", p: "Mateo 17:21", v: "Pero este género no sale sino con oración y ayuno." },
      { t: "El Espíritu intercede por ti", p: "Romanos 8:26", v: "Y de igual manera el Espíritu nos ayuda en nuestra debilidad; pues qué hemos de pedir como conviene, no lo sabemos, pero el Espíritu mismo intercede por nosotros." },
      { t: "Orar con denuedo", p: "Hechos 4:31", v: "Cuando hubieron orado, el lugar en que estaban congregados tembló; y todos fueron llenos del Espíritu Santo, y hablaban con denuedo la palabra de Dios." },
      { t: "La respuesta que viene volando", p: "Daniel 9:23", v: "Al principio de tus ruegos fue dada la orden, y yo he venido para enseñártela, porque tú eres muy amado." },
      { t: "Orar por la cosecha espiritual", p: "Mateo 9:38", v: "Rogad, pues, al Señor de la mies, que envíe obreros a su mies." },
      { t: "La bendición de la quietud", p: "Isaías 30:15", v: "En descanso y en reposo seréis salvos; en quietud y en confianza será vuestra fortaleza." },
      { t: "Derramar el corazón como agua", p: "Lamentaciones 2:19", v: "Levántate, da voces en la noche, al comenzar las vigilias; derrama como agua tu corazón ante la presencia del Señor." },
      { t: "Oración de protección familiar", p: "Job 1:5", v: "Y acontecía que... Job enviaba y los santificaba, y se levantaba de mañana y ofrecía holocaustos... porque decía: Quizá habrán pecado mis hijos." },
      { t: "La fe que mueve montañas", p: "Marcos 11:24", v: "Por tanto, os digo que todo lo que pidiereis orando, creed que lo recibiréis, y os vendrá." },
      { t: "Oración continua en el corazón", p: "Efesios 6:18", v: "Orando en todo tiempo con toda oración y súplica en el Espíritu, y velando en ello con toda perseverancia." },
      { t: "Alabanza de agradecimiento", p: "Filipenses 4:6", v: "Sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias." }
    ]
  },
  {
    month: 10,
    name: "Octubre",
    theme: "Integridad, Carácter y Santidad",
    daysCount: 31,
    topics: [
      { t: "El fruto del Espíritu", p: "Gálatas 5:22-23", v: "Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza." },
      { t: "Corazón limpio", p: "Salmos 51:10", v: "Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí." },
      { t: "La belleza de la santidad", p: "1 Pedro 1:15-16", v: "Sino, como aquel que os llamó es santo, sed también vosotros santos en toda vuestra manera de vivir; porque escrito está: Sed santos, porque yo soy santo." },
      { t: "Caminar rectamente", p: "Salmos 84:11", v: "Porque sol y escudo es Jehová Dios; gracia y gloria dará Jehová. No quitará el bien a los que andan en integridad." },
      { t: "Limpio de manos y puro de corazón", p: "Salmos 24:3-4", v: "¿Quién subirá al monte de Jehová? El limpio de manos y puro de corazón." },
      { t: "Dominio propio", p: "Proverbios 16:32", v: "Mejor es el que tarda en airarse que el fuerte; y el que se enseñorea de su espíritu, que el que toma una ciudad." },
      { t: "Huir de las pasiones", p: "2 Timoteo 2:22", v: "Huye también de las pasiones juveniles, y sigue la justicia, la fe, el amor y la paz, con los que de corazón limpio invocan al Señor." },
      { t: "Ojos puestos en lo puro", p: "Salmos 101:3", v: "No pondré delante de mis ojos cosa injusta." },
      { t: "Pensar en lo honesto y puro", p: "Filipenses 4:8", v: "Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable... en esto pensad." },
      { t: "La verdad en lo íntimo", p: "Salmos 51:6", v: "He aquí, tú amas la verdad en lo íntimo, y en lo secreto me has hecho comprender sabiduría." },
      { t: "Caminar como sabios", p: "Efesios 5:15-16", v: "Mirad, pues, con diligencia cómo andéis, no como necios sino como sabios, aprovechando bien el tiempo." },
      { t: "Sal y luz", p: "Mateo 5:14", v: "Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder." },
      { t: "El temor del Señor aparta del mal", p: "Proverbios 16:6", v: "Con misericordia y verdad se corrige el pecado, y con el temor de Jehová los hombres se apartan del mal." },
      { t: "Mansedumbre y humildad", p: "Colosenses 3:12", v: "Vestíos, pues, como escogidos de Dios, santos y amados, de entrañable misericordia, de benignidad, de humildad, de mansedumbre." },
      { t: "No juzgar a los demás", p: "Mateo 7:1-2", v: "No juzguéis, para que no seáis juzgados. Porque con el juicio con que juzgáis, seréis juzgados." },
      { t: "Un vaso de honra", p: "2 Timoteo 2:21", v: "Así que, si alguno se limpia de estas cosas, será instrumento para honra, santificado, útil al Señor." },
      { t: "La lengua que da vida", p: "Santiago 3:2", v: "Porque todos ofendemos muchas veces. Si alguno no ofende en palabra, éste es varón perfecto." },
      { t: "El valor de la lealtad", p: "Proverbios 3:3", v: "Nunca se aparten de ti la misericordia y la verdad; átalas a tu cuello, escríbelas en la tabla de tu corazón." },
      { t: "Hacer el bien a todos", p: "Gálatas 6:10", v: "Así que, según tengamos oportunidad, hagamos bien a todos, y mayormente a los de la familia de la fe." },
      { t: "Vivir en la luz", p: "1 Juan 1:7", v: "Pero si andamos en luz, como él está en luz, tenemos comunión unos con otros." },
      { t: "La paciencia ante la ofensa", p: "Proverbios 19:11", v: "La cordura del hombre detiene su furor, y su honra es pasar por alto la ofensa." },
      { t: "Ser hacedores de la Palabra", p: "Santiago 1:22", v: "Pero sed hacedores de la palabra, y no tan solamente oidores, engañándoos a vosotros mismos." },
      { t: "Purificados por la verdad", p: "Juan 17:17", v: "Santifícalos en tu verdad; tu palabra es verdad." },
      { t: "La justicia enaltece", p: "Proverbios 14:34", v: "La justicia engrandece a la nación; mas el pecado es afrenta de las naciones." },
      { t: "Sinceridad de corazón", p: "1 Crónicas 29:17", v: "Yo sé, Dios mío, que tú escudriñas los corazones, y que la rectitud te agrada." },
      { t: "Dar testimonio sin reproche", p: "1 Pedro 2:12", v: "Manteniendo buena vuestra manera de vivir entre los gentiles; para que en lo que murmuran de vosotros como de malhechores, glorifiquen a Dios." },
      { t: "El valor de la prudencia", p: "Proverbios 12:16", v: "El necio al punto da a conocer su ira; mas el prudente encubre la deshonra." },
      { t: "Firmes en las convicciones", p: "Daniel 1:8", v: "Y Daniel propuso en su corazón no contaminarse con la porción de la comida del rey." },
      { t: "Vivir con sobriedad", p: "Tito 2:11-12", v: "Porque la gracia de Dios se ha manifestado para salvación... enseñándonos que, renunciando a la impiedad... vivamos en este siglo sobria, justa y piadosamente." },
      { t: "La humildad precede a la honra", p: "Proverbios 15:33", v: "El temor de Jehová es enseñanza de sabiduría; y a la honra precede la humildad." },
      { t: "Perfeccionando la santidad", p: "2 Corintios 7:1", v: "Así que, amados, teniendo tales promesas, limpiémonos de toda contaminación de carne y de espíritu, perfeccionando la santidad en el temor de Dios." }
    ]
  },
  {
    month: 11,
    name: "Noviembre",
    theme: "Gratitud, Generosidad y Alabanza",
    daysCount: 30,
    topics: [
      { t: "Entrad por sus puertas con gratitud", p: "Salmos 100:4", v: "Entrad por sus puertas con acción de gracias, por sus atrios con alabanza; alabadle, bendecid su nombre." },
      { t: "Dar gracias en todo", p: "1 Tesalonicenses 5:18", v: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús." },
      { t: "Bendice alma mía a Jehová", p: "Salmos 103:1", v: "Bendice, alma mía, a Jehová, y bendiga todo mi ser su santo nombre." },
      { t: "El dador alegre", p: "2 Corintios 9:7", v: "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre." },
      { t: "Más bienaventurado es dar que recibir", p: "Hechos 20:35", v: "Recordar las palabras del Señor Jesús, que dijo: Más bienaventurado es dar que recibir." },
      { t: "El cántico nuevo", p: "Salmos 40:3", v: "Puso luego en mi boca cántico nuevo, alabanza a nuestro Dios. Verán esto muchos, y temerán, y confiarán en Jehová." },
      { t: "Agradecidos en el corazón", p: "Colosenses 3:17", v: "Y todo lo que hacéis, sea de palabra o de hecho, hacedlo todo en el nombre del Señor Jesús, dando gracias a Dios Padre por medio de él." },
      { t: "Generosidad que cosecha bendición", p: "Proverbios 11:25", v: "El alma generosa será prosperada; y el que saciare, él también será saciado." },
      { t: "Alabanza que habita Dios", p: "Salmos 22:3", v: "Pero tú eres santo, tú que habitas entre las alabanzas de Israel." },
      { t: "La memoria de su bondad", p: "Salmos 145:7", v: "Proclamarán la memoria de tu inmensa bondad, y cantarán tu justicia." },
      { t: "Sembrar abundantemente", p: "2 Corintios 9:6", v: "El que siembra escasamente, también segará escasamente; y el que siembra generosamente, generosamente también segará." },
      { t: "Ofrenda de alabanza continua", p: "Hebreos 13:15", v: "Así que, ofrezcamos siempre a Dios, por medio de él, sacrificio de alabanza, es decir, fruto de labios que confiesan su nombre." },
      { t: "Contentamiento que llena el alma", p: "Hebreos 13:5", v: "Sean vuestras costumbres sin avaricia, contentos con lo que tenéis ahora." },
      { t: "Celebrar la fidelidad de Dios", p: "Salmos 89:1", v: "Las misericordias de Jehová cantaré perpetuamente; de generación en generación haré notoria tu fidelidad con mi boca." },
      { t: "Dar a los necesitados", p: "Proverbios 19:17", v: "A Jehová presta el que da al pobre, y el bien que ha hecho, se lo volverá a pagar." },
      { t: "Un corazón desbordante de gratitud", p: "Salmos 116:12", v: "¿Qué pagaré a Jehová por todos sus beneficios para conmigo?" },
      { t: "Reconocer a Dios en los triunfos", p: "Deuteronomio 8:17-18", v: "Y digas en tu corazón: Mi poder y la fuerza de mi mano me han traído esta riqueza... Sino acuérdate de Jehová tu Dios." },
      { t: "Alabar en la congregación", p: "Salmos 35:18", v: "Te confesaré en grande congregación; te alabaré entre numeroso pueblo." },
      { t: "La recompensa del que ayuda", p: "Mateo 25:40", v: "En cuanto lo hicisteis a uno de estos mis hermanos más pequeños, a mí lo hicisteis." },
      { t: "Gratitud por la salvación", p: "Salmos 118:21", v: "Te alabaré porque me has oído, y me fuiste por salvación." },
      { t: "Alabanza matutina", p: "Salmos 92:1-2", v: "Bueno es alabarte, oh Jehová, y cantar salmos a tu nombre... Anunciar por la mañana tu misericordia, y tu fidelidad cada noche." },
      { t: "Riquezas para compartir", p: "1 Timoteo 6:18", v: "Que hagan bien, que sean ricos en buenas obras, dadivosos, generosos." },
      { t: "Cantar con entendimiento", p: "1 Corintios 14:15", v: "Cantaré con el espíritu, pero cantaré también con el entendimiento." },
      { t: "La copa que rebosa", p: "Salmos 23:5", v: "Unges mi cabeza con aceite; mi copa está rebosando." },
      { t: "Bendecir en todo tiempo", p: "Salmos 145:1-2", v: "Te exaltaré, mi Dios, mi Rey, y bendeciré tu nombre eternamente y para siempre. Cada día te bendeciré." },
      { t: "El agradecimiento vence la queja", p: "Filipenses 2:14", v: "Haced todo sin murmuraciones y contiendas." },
      { t: "La provisión que no falta", p: "Salmos 37:25", v: "Joven fui, y he envejecido, y no he visto justo desamparado, ni su descendencia que mendigue pan." },
      { t: "Alabar con instrumentos y danza", p: "Salmos 150:6", v: "Todo lo que respira alabe a JAH. Aleluya." },
      { t: "Dar gracias por los hermanos en la fe", p: "Filipenses 1:3", v: "Doy gracias a mi Dios siempre que me acuerdo de vosotros." },
      { t: "El amor de Dios que no cambia", p: "Salmos 136:1", v: "Alabad a Jehová, porque él es bueno, porque para siempre es su misericordia." }
    ]
  },
  {
    month: 12,
    name: "Diciembre",
    theme: "Gozo, Promesas, Enmanuel y Victoria",
    daysCount: 31,
    topics: [
      { t: "Dios con nosotros: Emanuel", p: "Mateo 1:23", v: "He aquí, una virgen concebirá y dará a luz un hijo, y llamarás su nombre Emanuel, que traducido es: Dios con nosotros." },
      { t: "Príncipe de Paz", p: "Isaías 9:6", v: "Porque un niño nos es nacido, hijo nos es dado, y el principado sobre su hombro; y se llamará su nombre Admirable, Consejero, Dios Fuerte, Padre Eterno, Príncipe de Paz." },
      { t: "Buenas nuevas de gran gozo", p: "Lucas 2:10-11", v: "Pero el ángel les dijo: No temáis; porque he aquí os doy nuevas de gran gozo, que será para todo el pueblo: que os ha nacido hoy... un Salvador, que es CRISTO el Señor." },
      { t: "Gloria a Dios en las alturas", p: "Lucas 2:14", v: "¡Gloria a Dios en las alturas, y en la tierra paz, buena voluntad para con los hombres!" },
      { t: "La estrella de la mañana", p: "Apocalipsis 22:16", v: "Yo soy la raíz y el linaje de David, la estrella resplandeciente de la mañana." },
      { t: "Promesas firmes", p: "2 Corintios 1:20", v: "Porque todas las promesas de Dios son en él Sí, y en él Amén, por medio de nosotros, para la gloria de Dios." },
      { t: "Gozo inefable y glorioso", p: "1 Pedro 1:8", v: "A quien amáis sin haberle visto, en quien creyendo, aunque ahora no lo veáis, os alegráis con gozo inefable y glorioso." },
      { t: "El regalo inefable de Dios", p: "2 Corintios 9:15", v: "¡Gracias a Dios por su don inefable!" },
      { t: "La esperanza de gloria", p: "Colosenses 1:27", v: "A quienes Dios quiso dar a conocer las riquezas de la gloria de este misterio... que es Cristo en vosotros, la esperanza de gloria." },
      { t: "Paz a los que buscan a Dios", p: "Salmos 85:8", v: "Escucharé lo que hablará Jehová Dios; porque hablará paz a su pueblo y a sus santos." },
      { t: "La luz verdadera alumbra", p: "Juan 1:9", v: "Aquella luz verdadera, que alumbra a todo hombre, venía a este mundo." },
      { t: "Dios cumple su palabra", p: "Números 23:19", v: "Dios no es hombre, para que mienta, ni hijo de hombre para que se arrepienta. Dijo, ¿y no hará? Habló, ¿y no lo ejecutará?" },
      { t: "Celebrar la vida en Cristo", p: "1 Juan 5:11-12", v: "Y este es el testimonio: que Dios nos ha dado vida eterna; y esta vida está en su Hijo. El que tiene al Hijo, tiene la vida." },
      { t: "El gozo de la presencia de Dios", p: "Salmos 16:11", v: "Me mostrarás la senda de la vida; en tu presencia hay plenitud de gozo; delicias a tu diestra para siempre." },
      { t: "El Dios de la esperanza te llene", p: "Romanos 15:13", v: "Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo." },
      { t: "El reino de Dios es justicia, paz y gozo", p: "Romanos 14:17", v: "Porque el reino de Dios no es comida ni bebida, sino justicia, paz y gozo en el Espíritu Santo." },
      { t: "El cántico de María", p: "Lucas 1:46-47", v: "Engrandece mi alma al Señor; y mi espíritu se regocija en Dios mi Salvador." },
      { t: "Un año coronado de favores", p: "Salmos 65:11", v: "Tú coronas el año con tus bienes, y tus rodadas destilan grosura." },
      { t: "Cerrar ciclos en gratitud", p: "Salmos 107:1", v: "Alabad a Jehová, porque él es bueno; porque para siempre es su misericordia." },
      { t: "Fiel hasta el fin", p: "1 Tesalonicenses 5:24", v: "Fiel es el que os llama, el cual también lo hará." },
      { t: "No temas al mañana", p: "Mateo 6:34", v: "Así que, no os afanéis por el día de mañana, porque el día de mañana traerá su afán." },
      { t: "Dios guarda tu salida y tu entrada", p: "Salmos 121:8", v: "Jehová guardará tu salida y tu entrada desde ahora y para siempre." },
      { t: "El gozo que nadie te quitará", p: "Juan 16:22", v: "También vosotros ahora tenéis tristeza; pero os volveré a ver, y se gozará vuestro corazón, y nadie os quitará vuestro gozo." },
      { t: "La gracia que sobreabunda", p: "Romanos 5:20", v: "Mas cuando el pecado abundó, sobreabundó la gracia." },
      { t: "Un corazón lleno de paz", p: "Juan 14:1", v: "No se turbe vuestro corazón; creéis en Dios, creed también en mí." },
      { t: "Victoria garantizada", p: "1 Corintios 15:57", v: "Mas gracias sean dadas a Dios, que nos da la victoria por medio de nuestro Señor Jesucristo." },
      { t: "El nombre sobre todo nombre", p: "Filipenses 2:9-10", v: "Por lo cual Dios también le exaltó hasta lo sumo, y le dio un nombre que es sobre todo nombre, para que en el nombre de Jesús se doble toda rodilla." },
      { t: "La herencia eterna", p: "1 Pedro 1:4", v: "Para una herencia incorruptible, incontaminada e inmarcesible, reservada en los cielos para vosotros." },
      { t: "Dios hace nuevas todas las cosas", p: "Apocalipsis 21:5", v: "Y el que estaba sentado en el trono dijo: He aquí, yo hago nuevas todas las cosas." },
      { t: "Mirar hacia adelante con fe", p: "Isaías 43:18-19", v: "No os acordéis de las cosas pasadas, ni traigáis a memoria las cosas antiguas. He aquí que yo hago cosa nueva; pronto saldrá a luz." },
      { t: "La bendición final del año", p: "Números 6:24-26", v: "Jehová te bendiga, y te guarde; Jehová haga resplandecer su rostro sobre ti, y tenga de ti misericordia; Jehová alce sobre ti su rostro, y ponga en ti paz." }
    ]
  }
];

// Redacción propia por día. Cada tema puede traer:
//   r: reflexión · d: declaración · o: sugerencia de oración
// Mientras un mes no esté redactado, cae en las plantillas de abajo.
function pickReflection(topic, theme, day, monthName) {
  return topic.r || generateReflection(topic, theme, day, monthName);
}

function pickDeclaration(topic) {
  return topic.d || generateDeclaration(topic);
}

function pickPrompt(topic) {
  return topic.o || generatePrayerPrompt(topic);
}

function generateReflection(topic, theme, day, monthName) {
  const reflections = [
    `En este día de ${monthName}, recuerda que Dios tiene un propósito específico para cada minuto que vives. El pasaje de hoy (${topic.p}) nos recuerda que cuando ponemos nuestra mirada en Dios y no en las circunstancias que nos rodean, Su paz inunda nuestro corazón. Tómate este breve momento de oración para alinear tus pensamientos con la voluntad del Padre.`,
    `A veces el ritmo acelerado del día a día nos hace creer que no hay tiempo para orar. Sin embargo, como dice nuestro lema, nunca estás demasiado ocupado para orar. El texto bíblico de hoy nos anima a confiar plenamente en las promesas de Dios, sabiendo que Él cuida de ti, de tu familia y de cada detalle de tu futuro.`,
    `Dios no busca oraciones largas o complicadas, sino corazones sinceros dispuestos a escuchar Su voz y actuar con amor. Al meditar en ${topic.p}, permite que esta verdad transforme tu actitud hoy. Sé un instrumento de bendición y fe para las personas con las que hables.`,
    `La clave para vivir en victoria radica en comenzar el día rindiendo nuestras cargas al Señor. Dios conoce tus anhelos más profundos y está obrando a tu favor aún cuando no lo ves. Descansa en Su fidelidad y declara hoy con fe que Su gracia te acompaña dondequiera que vayas.`
  ];
  return reflections[(day + topic.t.length) % reflections.length];
}

function generateDeclaration(topic) {
  const declarations = [
    `Declaro que hoy camino en la victoria, la paz y el favor de Dios sobre mi vida y mi familia.`,
    `Hoy decido confiar plenamente en el Señor; ninguna duda ni temor frenará lo que Dios tiene preparado para mí.`,
    `Declaro que la gracia de Dios me sostiene, Su sabiduría guía mis decisiones y Su amor se refleja en mis acciones.`,
    `Hoy abro mi corazón para ser de bendición a otros y testificar de la grandeza y bondad de Dios en mi vida.`
  ];
  return declarations[topic.t.length % declarations.length];
}

function generatePrayerPrompt(topic) {
  const prompts = [
    `Pide a Dios sabiduría para aplicar este versículo hoy en tu trabajo, hogar y decisiones.`,
    `Toma 30 segundos para agradecer a Dios por Su fidelidad y entrega tus preocupaciones en Sus manos.`,
    `Ora por fortaleza y pide al Espíritu Santo que te guíe a ser luz y paz para quienes te rodean.`,
    `Declara en voz alta la promesa de este pasaje sobre ti y sobre las 3 personas por las que orarás hoy.`
  ];
  return prompts[topic.t.length % prompts.length];
}

const allDevotionals = [];
let globalDayId = 1;

for (const m of monthsData) {
  for (let d = 1; d <= m.daysCount; d++) {
    const topic = m.topics[d - 1] || m.topics[0];
    const dev = {
      id: globalDayId,
      day: d,
      month: m.month,
      monthName: m.name,
      theme: m.theme,
      title: topic.t,
      passage: topic.p,
      verse: topic.v,
      reflection: pickReflection(topic, m.theme, d, m.name),
      declaration: pickDeclaration(topic),
      prayerPrompt: pickPrompt(topic)
    };
    allDevotionals.push(dev);
    globalDayId++;
  }
}

const outputDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'devotionals.json');
fs.writeFileSync(outputPath, JSON.stringify(allDevotionals, null, 2), 'utf-8');

console.log(`Successfully generated ${allDevotionals.length} devotionals in ${outputPath}`);
