let moment = require("moment")
let _      = require("underscore")

// Dummy app instance to use for testing the working of getData function.
let app = {
  models : {
    Consumer : {
      configparamarray : [],
      findById(consumerId) {
        return Promise.resolve()
        .then(() => {
          if(consumerId == "123") {
            return {
              Name    : "Test",
              EmailID : "test@abc.com",
              MobileNo: "1234567890",
              AlternateMobileNo : "98765432210"
            }
          }
  
          return null
        })
      }
    },
    Manager : {
      findById(managerId) {
        return Promise.resolve()
        .then(() => {
          let objToReturn = {
            ModelNo                  : "abc123456",
            DownloadedDeviceUniqueKey: "devunikey754653",
            AlternateUniqueKey       : "altunikey754653",
            IsUnderWarranty          : true,
            DateOfPurchase           : "2018-08-21"
          }

          switch(managerId) {
            case "manager123" :
              objToReturn.CompanyID    = 15
              objToReturn.DepartmentID =  "345233";
              break;
            
            case "manager456" :
              objToReturn.CompanyID    = 16
              objToReturn.DepartmentID =  "1232323";
              break;

            case "manager789" :
              objToReturn.CompanyID    = 16
              objToReturn.DepartmentID = "534134"
              break;

            case "manager118" :
              objToReturn.CompanyID    = 17
              objToReturn.DepartmentID = "534134"
            break;

            default:
              objToReturn = null;
              break;
          }

          return objToReturn
        })
      }
    },
    Company : {
      findById(companyId) {
        if(companyId == 15 || companyId == 16)
          return {
            CompanyName : "Test"
          }

        return null
      }
    },
    Department : {
      findById(departmentId) {
        return Promise.resolve()
        .then(() => {
          let objToReturn = {}

          switch(departmentId) {
            case "345233":
              objToReturn.DepartmentName          = "TestDeptName";
              objToReturn.DepartmentSubCategoryID = 99;
              objToReturn.SubCategoryID           = 98;
              break;

            case "1232323":
              objToReturn.DepartmentName          = "TestDeptName2";
              objToReturn.DepartmentSubCategoryID = 100;
              objToReturn.SubCategoryID           = 99;
              break;

            default:
              objToReturn = null;
              break;
          }
          
          return objToReturn
        })
      }
    },
    JobType : {
      findOne(query) {
        return Promise.resolve()
        .then(() => {
          if(query["where"].JobTypeID == 45) {
            return {
              Type : "testJob"
            }
          }
  
          return null
        })
      }
    },
    Subcategory : {
      findOne(query) {
        return Promise.resolve()
        .then(() => {
          if(query["where"].SubCategoryID == 98) {
            return {
              DepartmentSubCategory : "Test_Department_Sub_Category"
            }
          }
  
          return null
        })
      }
    },
    Team : {
      findOne() {
        return Promise.resolve()
        .then(() => {
          return {
            Department : "TestDept"
          }
        })
      }
    },
    CompanyData : {
      findOne() {
        return Promise.resolve()
        .then(() => {
          return {
            DepartmentCategoryCode : "76543"
          }  
        })
      }
    },
    EmployeeAddress : {
      findOne() {
        return Promise.resolve()
        .then(() => {
          return {
            Zipcode : "123412"
          }  
        })
      }
    },
    IntegratedCompanyDetails : {
      findOne() {
        return Promise.resolve()
        .then(() => {
          return {
            IntegratedConsumerID : "172393"
          }
        })
      }
    },
    CompanyLogistics : {
      findOne() {
        return Promise.resolve()
        .then(() => {
          return {
            Vendor : "TestVendor"
          }
        })
      }
    },
    CompanyDepartments : {
      find() {
        return Promise.resolve()
        .then(() => {
          return []  
        })
      }
    },
    CompanyLocation : {
      findOne() {
        return Promise.resolve()
        .then(() => {
          return {
            EmailID : "abc1234@xyz.com"
          }  
        })
      }
    }
  }
}

/**
 * 
 * @param {Object containing details of issue or defect being reported w.r.t Model of device and also its associated dealer} data 
 * @param {Callback function to execute once for sending success object(with or without data). Errors won't be sent by this callback function.} cb 
 */
function getData(data, cb) {
  // Fetches consumer config params
	var configparamarray = app.models.Consumer.configparamarray

  // Assigns default object incase data is null or undefined
  data = data || {}

  // Checks if any Issues param is received. If not then default IssueText as Other is assigned
	if (!data.Issues) {
		data.Issues = [{
			IssueText  : 'Other'
		}];
  }

  // Creates time and fromtime object to schedule
	var time     = moment("1974-01-01 " + data.ScheduledToTime, "YYYY-MM-DD HH:mm:ss");
  var fromtime = moment("1974-01-01 " + data.ScheduledFromTime, "YYYY-MM-DD HH:mm:ss");
  
  let manager, companyDetails, deptDetails, consumerDetails, jobDetails, subCategoryDetails, teamDetails, companyData, empAddressDetails, integrtdCompanyDetails, compLogisticsDetails, compDeptListDetails;

  // Check is data contains a valid ManagerID. If not, then execute callback function with No data.
	if (data.ManagerID) {
    // Use Manager Model in app instance to fetch details of Manager
		return app.models.Manager.findById(data.ManagerID)
    .then(function (managerObj) {
      if (managerObj) {
        // Assign managerObj to manager variable created
        manager = managerObj

        // Use Company Model in app instance to fetch company details
        return app.models.Company.findById(manager.CompanyID)
      }

      // If no manager details are found, then throw error
      throw new Error("No manager details found")
    })
    .then(function (companyResult) {
      if(companyResult) {
        // Assign companyResult to companyDetails variable created
        companyDetails = companyResult

        // Use Department Model in app instance to fetch Department details
        return app.models.Department.findById(manager.DepartmentID)
      }

      // If no Company details are found, then throw error
      throw new Error("No company details found")
    })
    .then(function (deptObj) {
      if(deptObj) {
        // Assign deptObj to deptDetails variable created
        deptDetails = deptObj

        // Use Consumer Model in app instance to fetch Consumer details
        return app.models.Consumer.findById(data.ConsumerID)
      }

      // If no Department details are found, then throw error
      throw new Error("No department details found")
    })
    .then(function (consumerObj) {
      if(consumerObj) {
        // Assign consumerObj to consumerDetails variable created
        consumerDetails = consumerObj

        // Use JobType Model in app instance to fetch Job details
        return app.models.JobType.findOne({
          where: {
            JobTypeID: data.JobTypeID
          }
        })
      }

      // If no Consumer details are found, then throw error
      throw new Error("No Consumer details found")
    })
    .then(function (jobTypeResult) {
      if(jobTypeResult) {
        // Assign jobTypeResult to jobDetails variable created
        jobDetails = jobTypeResult

        // Use SubCategory Model in app instance to fetch SubCategory details
        return app.models.Subcategory.findOne({
          where: {
            SubCategoryID: deptDetails.SubCategoryID
          }
        })
      }
      
      // If no JobType details are found, then throw error
      throw new Error("No Job type details found")
    })
    .then(function (subcategoryResult) {
      if(subcategoryResult) {
        // Assign subcategoryResult to subCategoryDetails variable created
        subCategoryDetails = subcategoryResult

        // Use Team Model in app instance to fetch Team details
        return app.models.Team.findOne({
          where: {
            DepartmentID: manager.DepartmentID
          }
        })
      }
      
      // If no SubCategory details are found, then throw error
      throw new Error("No SubCategory details found")
    })
    .then(function (teamResult) {
      // Assign teamResult to teamDetails variable created
      teamDetails = teamResult

      // Use CompanyData Model in app instance to fetch Company Data
      return app.models.CompanyData.findOne({
        where: {
          DepartmentID: manager.DepartmentID
        }
      })
    })
    .then(function (companyDataResult) {
      // Assign companyDataResult to companyData variable created
      companyData = companyDataResult

      // Use EmployeeAddress Model in app instance to fetch Employee Details
      return app.models.EmployeeAddress.findOne({
        where: {
          Landmark: data.Landmark,
          Address: data.Address
        }
      })
    })
    .then(function (empAddressObj) {
      // Assign empAddressObj to empAddressDetails variable created
      empAddressDetails = empAddressObj

      // Use IntegratedCompanyDetails Model in app instance to fetch Integrated Company Details
      return app.models.IntegratedCompanyDetails.findOne({
        where: {
          ConsumerID: data.ConsumerID
        }
      })
    })
    .then(function (integratedCompanyDetails) {
      // Assign integratedCompanyDetails to integrtdCompanyDetails variable created
      integrtdCompanyDetails = integratedCompanyDetails;

      // Use CompanyLogistics Model in app instance to fetch Company Logistics Details
      return app.models.CompanyLogistics.findOne({
        where: {
          CompanyID: data.CompanyID
        }
      })
    })
    .then(function (companyLogisticsObj) {
      // Assign companyLogisticsObj to compLogisticsDetails variable created
      compLogisticsDetails = companyLogisticsObj

      // Use CompanyDepartments Model in app instance to fetch Company Department Details
      return app.models.CompanyDepartments.find({
        where: {
          DepartmentID: data.DepartmentID
        }
      })   
    })
    .then(function (companyDeptList) {
      // Assign companyDeptList to compDeptListDetails variable created
      compDeptListDetails = companyDeptList

      // Use CompanyLocation Model in app instance to fetch Company Location Details
      return app.models.CompanyLocation.findOne({
        where: {
          CompanyLocationID: data.CompanyLocationID
        }
      })
    })
    .then(function (companyLocationObj) {
      var resObj               = companyLocationObj || {};
      resObj.slotEndTime       = moment(time, "YYYY-MM-DD HH:mm:ss").add(parseFloat("5.5"), 'hours').format("h:mm A").toString();
      resObj.slotStartTime     = moment(fromtime, "YYYY-MM-DD HH:mm:ss").add(parseFloat("5.5"), 'hours').format("h:mm A").toString();

      resObj.Name              = consumerDetails.Name;
      resObj.EmailID           = consumerDetails.EmailID;
      resObj.MobileNo          = consumerDetails.MobileNo;
      resObj.SupplierJobNumber = data.ReferenceID;
      resObj.ModelNo           = manager.ModelNo;
      resObj.DepartmentName    = deptDetails.DepartmentName;
      resObj.CompanyName       = companyDetails.CompanyName;

      // Check CompanyID and JobTypeID to assign ServiceType for resObj
      if (manager.CompanyID == 16 && data.JobTypeID == 5 || data.JobTypeID == 6) {
        resObj.ServiceType = 'Demo / Installation';
      } else {
        resObj.ServiceType = jobDetails.Type;
      }

      if (companyLocationObj) {
        resObj.serviceLocationEmail = companyLocationObj.EmailID;
      }

      if (data.PartnerID && configparamarray) {
        var selectedObj = _.find(configparamarray['ServiceLocationFilter'], {
          PartnerID: data.PartnerID
        })

        if (selectedObj) {
          resObj.OnboardedFrom = selectedObj.OnboardedFrom;
        }
      }

      resObj.DepartmentSubCategory     = subCategoryDetails.DepartmentSubCategory;
      resObj.DepartmentSubCategoryID   = deptDetails.DepartmentSubCategoryID;
      resObj.scheduleDate              = moment(data.ScheduledDateTime).format('YYYY-MM-DD');
      resObj.DownloadedDeviceUniqueKey = manager.DownloadedDeviceUniqueKey;
      resObj.ZipCode                   = data.Zipcode;
      
      if (compLogisticsDetails) {
        resObj.VendorName = compLogisticsDetails.Vendor;
      } else {
        console.log('no logistics details found');
      }

      if (manager.DepartmentUniqueID) {
        resObj.DepartmentUniqueID = manager.DepartmentUniqueID;
      }

      if (empAddressDetails) {
        resObj.ZipCode = empAddressDetails.Zipcode;
      }

      if (manager.AlternateUniqueKey) {
        resObj.AlternateDepartmentUniqueID = manager.AlternateUniqueKey;
      }

      if (teamDetails) {
        resObj.Department = teamDetails.Department;
      }

      if (companyData) {
        resObj.DepartmentCategoryCode = companyData.DepartmentCategoryCode;
      }

      if (integrtdCompanyDetails) {
        resObj.cmiRelationShipNo = integrtdCompanyDetails.IntegratedConsumerID;
      }

      resObj.AlternateMobileNo = consumerDetails.AlternateMobileNo;
      resObj.IsUnderWarranty   = manager.IsUnderWarranty;
      if (manager.DateOfPurchase) {
        resObj.DateOfPurchase = moment(manager.DateOfPurchase).format('YYYY-MM-DD');
        resObj.DOP            = moment(manager.DateOfPurchase).format('YYYY/MM/DD');
      }

      if (data.DealerName) {
        resObj.DealerName = data.DealerName;
      }

      if (data.ModelNo) {
        resObj.ModelNo = data.ModelNo;
      }

      if (data.Remarks) {
        data.Remarks         = JSON.parse(data.Remarks);
        resObj.wayBillNumber = data.Remarks.waybill;
      }

      if (compDeptListDetails && compDeptListDetails.length) {
        resObj.issueText = _.map(compDeptListDetails, 'IssueText');
      }

      if (data.Issues && data.Issues.length && !compDeptListDetails.length) { 
        resObj.issueText = _.map(data.Issues, 'IssueText');
      }


      // Execute callback with message and response object
      return cb(null, {
        success: true,
        msg    : 'Data obtained',
        data   : resObj
      });
    })
    .catch(function (error) {
      throw error
    });
  }
  
  // Execute callback incase ManagerID is not obtained from data param. Execute callback by wrapping it in a Promise.
  return Promise.resolve(cb(null, {
    success: true,
    msg    : 'No Data To Return',
    data   : {}
  }))
}

module.exports = {
  getData : getData
}