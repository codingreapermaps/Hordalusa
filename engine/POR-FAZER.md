# Por fazer, nesta pasta

As imagens do devlog já estão todas cá. O que falta é isto.

## A marca no rádio

O `signal-lost-radio-02.png` tem "KENWOOD" serigrafado no corpo do rádio, e está
legível. É uma marca real, num modelo nosso, numa página pública do estúdio.
Esbater a serigrafia ou trocar por um nome inventado, e voltar a exportar por
cima do ficheiro com o mesmo nome.

## O ruído no render do hall

O `signal-lost-hall-01.png` tem granulado de sampling nas paredes iluminadas, e
vêem-se as paredes cortadas em cima. Serve, mas um render com mais samples e um
enquadramento sem o corte ficava bastante melhor. Mesmo nome de ficheiro.

## A cadeira de baloiço

Ainda está sem texturas, em cinzento de argila, por isso ficou fora da v0.9.
Quando estiver texturada: guardar como `signal-lost-prop-chair.png`, mudar
`data-shots="5"` para `"6"` na entrada v0.9 e acrescentar mais um `<figure>`.

## A personagem

A entrada **v0.8** está escrita no `lusa-engine.html` mas comentada. O modelo
ainda mostra facetas nas pernas, mãos sem dedos definidos e a pose de modelação
— e é a única imagem do jogo cujo efeito se gasta ao ser vista cedo. Quando
estiver pronta e houver um render dela no escuro com a lanterna: guardar como
`signal-lost-figure-01.png` e tirar o comentário à volta do bloco.

---

Nota: se voltares a exportar alguma imagem com tamanho diferente, atualiza os
atributos `width`/`height` do `<img>` correspondente — estão lá para o browser
reservar o espaço certo e a página não saltar enquanto carrega.
