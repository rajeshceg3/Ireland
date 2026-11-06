import{parseItineraryRestore}from'./restore';
const file={schema:1,app:'ireland',kind:'selected-version-restore',value:[{id:'two',name:'Second'},{id:'one',name:'Literal தமிழ் <place>'}]};
test('selected order and explicit empty restore preserved',()=>{expect(parseItineraryRestore(JSON.stringify(file))).toEqual(file.value);expect(parseItineraryRestore(JSON.stringify({...file,value:[]}))).toEqual([])});
test('wrong app, duplicate IDs and malformed records rejected',()=>{for(const bad of [{...file,app:'esp32'},{...file,value:[file.value[0],file.value[0]]},{...file,value:[{id:4,name:'wrong'}]}])expect(()=>parseItineraryRestore(JSON.stringify(bad))).toThrow()});
