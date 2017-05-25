$ = require 'jquery'

do fill = (item = 'The most unbelievably, superlatively creative minds in Art') ->
  $('.tagline').append "#{item}"
fill