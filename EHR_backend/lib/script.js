/**
 * @param {org.example.basic.Create_patient} Create_patient
 * @transaction
 */
function Create_patient(Create_patient){
   alert("")
   var factory = getFactory()
   var ns = "org.example.basic"
   var patient = factory.newResource(ns,"patient",Create_patient.name)
   patient.age = Create_patient.age
   patient.flag = "EHR_not_available"
   return getParticipantRegistry('org.example.basic.patient')
  .then(function (participantRegistry) {
    return participantRegistry.add(patient);
  })
	
}

/**
 * @param {org.example.basic.Create_doctor} Create_doctor
 * @transaction
 */

function Create_doctor(Create_doctor){
  
   var factory = getFactory()
   var ns = "org.example.basic"
   var doctor = factory.newResource(ns,"doctor",Create_doctor.name)
   doctor.age = Create_doctor.age
   
   var d = factory.newRelationship(ns,"hospital",Create_doctor.hospital.id)
   doctor.h = d
   return getParticipantRegistry('org.example.basic.doctor')
  .then(function (participantRegistry) {
    return participantRegistry.add(doctor);
  }) 
  
	
}


/**
 * @param {org.example.basic.Create_EHR} Create_EHR
 * @transaction
 */

function Create_EHR(Create_EHR){
  
   var factory = getFactory()
   var ns = "org.example.basic"
   
    return getParticipantRegistry('org.example.basic.patient')
   .then(function (participantRegistry) {
    return participantRegistry.get(Create_EHR.patient.name);
   }).then(function (patient){
   		if(patient.flag == "EHR_available"){
        	alert("EHR for " + patient.name + "exists")
          	return
        } else {
        		 alert("creating EHR")
          
                return getParticipantRegistry('org.example.basic.patient')
                 .then(function (participantRegistry) {
                  alert("updating patient")
                  patient.flag = "EHR_available"
                  return participantRegistry.update(patient);
                 }).then(function (){
                  alert("last create")
                	var ehr = factory.newResource(ns,"EHR",Create_EHR.id)
                 var d = factory.newRelationship(ns,"patient",Create_EHR.patient.name)
                 ehr.patient = d
                 return getAssetRegistry('org.example.basic.EHR')
                 .then(function (AssetRegistry) {
                  return AssetRegistry.add(ehr)
   }) 
                })
                
   
                 
        }
        	
   })
  }

/**
 * @param {org.example.basic.update_patient_ehr} update_patient_ehr
 * @transaction
 */ 	

function update_patient_ehr(update_patient_ehr){
  var ehr = update_patient_ehr.ehr
  ehr.data = update_patient_ehr.data
  return getAssetRegistry('org.example.basic.EHR')
  .then(function (AssetRegistry){
  	return AssetRegistry.update(ehr)
    
    })
 
}


