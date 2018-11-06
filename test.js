const chai   = require('chai')
const should = chai.should()
const expect = chai.expect
const index  = require("./index")

describe("Executing test suite for getData function", function() {
  let callback
  before(function(done) {
    callback = function(context, message) {
      return message
    }
    
    done()
  })

  describe("Checks for execution with valid data", function() {
    let data
    before(function(done) {
      data = {
        ScheduledToTime  : "13:25:00",
        ScheduledFromTime: "07:25:00",
        ManagerID        : "manager123",
        ConsumerID       : "123",
        JobTypeID        : 45,
        ReferenceID      : "4321",
        Zipcode          : "123412",
        DealerName       : "TestDealer",
        ModelNo          : "abc123456",
        Issues           : [{
          IssueText : "Issue 1"
        }, {
          IssueText : "Issue 2"
        }, {
          IssueText : "Issue 3"
        }]
      }

      done()
    })
    
    it("should return response object via callback for ManagerID=manager123", (done) => {
      let response = index.getData(data, callback)
      response.then(result => {
        result.success.should.equal(true)
        result.msg.should.equal("Data obtained")

        let resultData = result.data
        resultData.EmailID.should.equal("test@abc.com")
        resultData.slotEndTime.should.equal("6:55 PM")
        resultData.slotStartTime.should.equal("12:55 PM")
        resultData.Name.should.equal("Test")
        resultData.MobileNo.should.equal("1234567890")
        resultData.SupplierJobNumber.should.equal("4321")
        resultData.ModelNo.should.equal(data.ModelNo)
        resultData.DepartmentName.should.equal("TestDeptName")
        resultData.CompanyName.should.equal("Test")
        resultData.ServiceType.should.equal("testJob")
        resultData.serviceLocationEmail.should.equal("test@abc.com")
        resultData.DepartmentSubCategory.should.equal("Test_Department_Sub_Category")
        resultData.DepartmentSubCategoryID.should.equal(99)
        resultData.scheduleDate.should.equal("2018-11-06")
        resultData.DownloadedDeviceUniqueKey.should.equal("devunikey754653")
        resultData.ZipCode.should.equal(data.Zipcode)
        resultData.VendorName.should.equal("TestVendor")
        resultData.AlternateDepartmentUniqueID.should.equal("altunikey754653")
        resultData.Department.should.equal("TestDept")
        resultData.DepartmentCategoryCode.should.equal("76543")
        resultData.cmiRelationShipNo.should.equal("172393")
        resultData.AlternateMobileNo.should.equal("98765432210")
        resultData.IsUnderWarranty.should.equal(true)
        resultData.DateOfPurchase.should.equal("2018-08-21")
        resultData.DOP.should.equal("2018/08/21")
        resultData.cmiRelationShipNo.should.equal("172393")
        resultData.DealerName.should.equal(data.DealerName)
        resultData.issueText[0].should.equal(data.Issues[0].IssueText)
        resultData.issueText[1].should.equal(data.Issues[1].IssueText)
        resultData.issueText[2].should.equal(data.Issues[2].IssueText)
        
        done()
      })
    })
  })

  describe("Checks for error responses when invalid data is specified", function() {
    let data
    before(function(done) {
      data = {
        ScheduledToTime  : "13:25:00",
        ScheduledFromTime: "07:25:00", 
      }

      done()
    })
    
    it("should return message in callback when ManagerID is not passed in data", function(done) {
      index.getData(data, callback)
      .then(result => {
        result.success.should.equal(true)
        result.msg.should.equal("No Data To Return")
        expect(result.data).to.be.deep.equal({})

        done()
      })
    })

    it("should throw error when Manager details are not found", function(done) {
      data.ManagerID = "manager111"
      index.getData(data, callback)
      .catch(error => {
        error.message.should.equal("No manager details found")
        delete data.ManagerID
        done()
      })
    })

    it("should throw error when Company details are not found", function(done) {
      data.ManagerID = "manager118"
      index.getData(data, callback)
      .catch(error => {
        error.message.should.equal("No company details found")
        done()
      })
    })

    it("should throw error when Department details are not found", function(done) {
      data.ManagerID = "manager789";
      index.getData(data, callback)
      .catch(error => {
        error.message.should.equal("No department details found");
        done()
      })
    })

    it("should throw error when Consumer details are not found", function(done) {
      data.ManagerID = "manager123";
      index.getData(data, callback)
      .catch(error => {
        error.message.should.equal("No Consumer details found");
        done()
      })
    })

    it("should throw error when JobType details are not found", function(done) {
      data.ManagerID  = "manager123"
      data.ConsumerID = "123";
      index.getData(data, callback)
      .catch(error => {
        error.message.should.equal("No Job type details found");
        done()
      })
    })

    it("should throw error when Subcategory details are not found", function(done) {
      data.ManagerID  = "manager456";
      data.ConsumerID = "123"
      data.JobTypeID  = 45
      index.getData(data, callback)
      .catch(error => {
        error.message.should.equal("No SubCategory details found");
        done()
      })
    })
  })
})