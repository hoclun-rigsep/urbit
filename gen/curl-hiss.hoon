::
::::  /hoon/curl/gen
  ::
/?    310
/-  sole
[sole]
:-  %get  |=  {^ {a/hiss $~} usr/iden}
^-  (sole-request (cask httr))
?.  ?=($get p.q.a)
  ~|  %only-get-requests-supported-in-generators  :: XX enforced?
  !!
:-  *tang
:^  %|  `usr  `hiss`a
|=(hit/httr (sole-so %httr hit))
