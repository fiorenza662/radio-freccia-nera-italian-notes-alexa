'use strict';
const Alexa=require('ask-sdk-core');
const STREAM='https://radio.radiofreccianera.com/listen/italian_notes/radio128.mp3';
const ART='https://www.radiofreccianera.com/wp-content/uploads/2026/08/ITALIAN-NOTES.png';
const isIT=h=>(Alexa.getLocale(h.requestEnvelope)||'en-GB').toLowerCase().startsWith('it');
function play(h){const title=isIT(h)?'Radio Freccia Nera Note Italiane':'Radio Freccia Nera Italian Notes';const intro=isIT(h)?'Radio Freccia Nera Note Italiane.':'Radio Freccia Nera Italian Notes.';return h.responseBuilder.speak(intro).addDirective({type:'AudioPlayer.Play',playBehavior:'REPLACE_ALL',audioItem:{stream:{url:STREAM,token:'rfn-italian-notes-'+Date.now(),offsetInMilliseconds:0},metadata:{title,subtitle:'Radio Freccia Nera',art:{sources:[{url:ART}]},backgroundImage:{sources:[{url:ART}]}}}}).withShouldEndSession(true).getResponse();}
const Launch={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='LaunchRequest',handle:play};
const Play={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['PlayRadioIntent','AMAZON.ResumeIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:play};
const Stop={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['AMAZON.StopIntent','AMAZON.CancelIntent','AMAZON.PauseIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:h=>h.responseBuilder.addAudioPlayerStopDirective().withShouldEndSession(true).getResponse()};
const Help={canHandle:h=>Alexa.getRequestType(h.requestEnvelope)==='IntentRequest'&&['AMAZON.HelpIntent','AMAZON.FallbackIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),handle:h=>h.responseBuilder.speak(isIT(h)?"Di': Alexa, apri Note d'Italia.":'Say: Alexa, open Black Arrow Italian.').getResponse()};
const Audio={canHandle:h=>Alexa.getRequestType(h.requestEnvelope).startsWith('AudioPlayer.'),handle:h=>h.responseBuilder.getResponse()};
const End={canHandle:h=>['SessionEndedRequest','System.ExceptionEncountered'].includes(Alexa.getRequestType(h.requestEnvelope)),handle:h=>h.responseBuilder.getResponse()};
const Err={canHandle:()=>true,handle:(h,e)=>{console.error(e);return h.responseBuilder.speak(isIT(h)?'Si è verificato un problema.':'There was a problem.').getResponse();}};
exports.handler=Alexa.SkillBuilders.custom().addRequestHandlers(Launch,Play,Stop,Help,Audio,End).addErrorHandlers(Err).lambda();
