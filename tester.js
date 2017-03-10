var obm = new OxideBenchmarker();
var file1 = 'https://upload.wikimedia.org/wikipedia/commons/6/6c/0-cynefin-ORIGINEEL.jpg';
var file2 = 'https://upload.wikimedia.org/wikipedia/commons/1/18/F-35_EOTS.jpeg';

obm.load(file1);
obm.load(file2);

obm.load(file1);
obm.load(file2);

obm.load(file1);
obm.load(file2);

obm.load(file1+'?'+(new Date()).getTime());
obm.load(file2+'?'+(new Date()).getTime());

obm.load(file1+'?'+(new Date()).getTime());
obm.load(file2+'?'+(new Date()).getTime());

console.log( obm.getSpeed() );