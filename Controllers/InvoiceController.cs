using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Xml.Linq;

namespace invoice_admin_web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string apiBaseUrl = "https://preprod-api.myinvois.hasil.gov.my/api/v1.0";

        public InvoiceController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        // POST: api/invoice/submit
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitInvoice([FromBody] InvoiceRequest record)
        {
            try
            {
                // Step 1: Construct the Invoice JSON document
                var document = new
                {
                    _D = "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
                    _A = "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
                    _B = "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
                    Invoice = new List<object>
                    {
                    new
                    {
                        ID = new [] { new { _ = record.Irn } },
                        IssueDate = new [] { new { _ = record.IssueDate } },
                        IssueTime = new [] { new { _ = record.IssueTime } },
                        InvoiceTypeCode = new [] { new { _ = record.InvoiceTypeCode, listVersionID = "1.1" } },
                        DocumentCurrencyCode = new [] { new { _ = record.CurrencyCode } },
                        InvoicePeriod = new []
                        {
                            new
                            {
                                StartDate = new [] { new { _ = record.StartDate } },
                                EndDate = new [] { new { _ = record.EndDate } },
                                Description = new [] { new { _ = record.InvoicePeriodDescription } }
                            }
                        },
                        BillingReference = new []
                        {
                            new
                            {
                                AdditionalDocumentReference = new []
                                {
                                    new { ID = new [] { new { _ = record.BillingReferenceID } } }
                                }
                            }
                        },
                        AdditionalDocumentReference = new []
                        {
                            new
                            {
                                ID = new [] { new { _ = record.AdditionalDocumentReferenceID } },
                                DocumentType = new [] { new { _ = "CustomsImportForm" } },
                            }
                        },
                        AccountingSupplierParty = new[]
                        {
                            new
                            {
                                AdditionalAccountID = new []
                                {
                                    new { _ = record.SupplierAdditionalAccountID, schemeAgencyName = "CertEx" }
                                },
                                Party = new[]
                                {
                                    new
                                    {
                                        IndustryClassificationCode = new []
                                        {
                                            new { _ = record.SupplierIndustryCode, name = "Provision of telecommunications services" }
                                        },
                                        PartyIdentification = new[]
                                        {
                                            new { ID = new [] { new { _ = record.SupplierTIN, schemeID = "TIN" } } },
                                            new { ID = new [] { new { _ = record.SupplierBRN, schemeID = "BRN" } } },
                                            new { ID = new [] { new { _ = record.SupplierSST, schemeID = "SST" } } },
                                            new { ID = new [] { new { _ = record.SupplierTTX, schemeID = "TTX" } } }
                                        },
                                        PostalAddress = new[]
                                        {
                                            new
                                            {
                                                CityName = new [] { new { _ = record.SupplierCity } },
                                                PostalZone = new [] { new { _ = record.SupplierPostalCode } },
                                                CountrySubentityCode = new [] { new { _ = record.SupplierCountrySubentityCode } },
                                                AddressLine = new[]
                                                {
                                                    new { Line = new [] { new { _ = record.SupplierAddressLine1 } } },
                                                    new { Line = new [] { new { _ = record.SupplierAddressLine2 } } },
                                                    new { Line = new [] { new { _ = record.SupplierAddressLine3 } } }
                                                },
                                                Country = new []
                                                {
                                                    new { IdentificationCode = new [] { new { _ = record.SupplierCountryCode, listID = "3166-1", listAgencyID = "ISO" } } }
                                                }
                                            }
                                        },
                                        PartyLegalEntity = new[]
                                        {
                                            new { RegistrationName = new [] { new { _ = record.SupplierName } } }
                                        },
                                        Contact = new object[]
                                        {
                                            new
                                            {
                                                Telephone = new object[] { new { _ = record.SupplierTelephone } },
                                                ElectronicMail = new object[] { new { _ = record.SupplierEmail } }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        AccountingCustomerParty = new[]
                        {
                            new
                            {
                                Party = new[]
                                {
                                    new
                                    {
                                        PartyIdentification = new[]
                                        {
                                            new { ID = new [] { new { _ = record.CustomerTIN, schemeID = "TIN" } } },
                                            new { ID = new [] { new { _ = record.CustomerBRN, schemeID = "BRN" } } }
                                        },
                                        PostalAddress = new[]
                                        {
                                            new
                                            {
                                                CityName = new [] { new { _ = record.CustomerCity } },
                                                PostalZone = new [] { new { _ = record.CustomerPostalCode } },
                                                CountrySubentityCode = new [] { new { _ = record.CustomerCountrySubentityCode } },
                                                AddressLine = new[]
                                                {
                                                    new { Line = new [] { new { _ = record.CustomerAddressLine1 } } },
                                                    new { Line = new [] { new { _ = record.CustomerAddressLine2 } } },
                                                    new { Line = new [] { new { _ = record.CustomerAddressLine3 } } }
                                                },
                                                Country = new []
                                                {
                                                    new { IdentificationCode = new [] { new { _ = record.CustomerCountryCode, listID = "ISO3166-1", listAgencyID = "6" } } }
                                                }
                                            }
                                        },
                                        PartyLegalEntity = new[]
                                        {
                                            new { RegistrationName = new [] { new { _ = record.CustomerName } } }
                                        },
                                        Contact = new object[]
                                        {
                                            new
                                            {
                                                Telephone = new object[] { new { _ = record.CustomerTelephone } },
                                                ElectronicMail = new object[] { new { _ = record.CustomerEmail } }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        LegalMonetaryTotal = new[]
                        {
                            new { PayableAmount = new [] { new { _ = record.TotalAmount, currencyID = "MYR" } } }
                        },
                        InvoiceLine = record.ItemList.ConvertAll(item => new
                        {
                            ID = new [] { new { _ = item.Id } },
                            InvoicedQuantity = new [] { new { _ = item.Qty, unitCode = item.Unit } },
                            LineExtensionAmount = new [] { new { _ = item.TotItemVal, currencyID = "MYR" } },
                            Item = new []
                            {
                                new
                                {
                                    Description = new[] { new { _ = item.Description } },

                                    // Add CommodityClassification section
                                    CommodityClassification = new[]
                                    {
                                        new
                                        {
                                            ItemClassificationCode = new[]
                                            {
                                                new { _ = "001", listID = "CLASS" }
                                            }
                                        }
                                    },

                                    // Add OriginCountry section
                                    OriginCountry = new[]
                                    {
                                        new
                                        {
                                            IdentificationCode = new[]
                                            {
                                                new
                                                {
                                                    _ = "MY",  // Replace with appropriate ISO 3166-1 code for the country
                                                    listID = "ISO3166-1",
                                                    listAgencyID = "6"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            Price = new []
                            {
                                new { PriceAmount = new [] { new { _ = item.UnitPrice, currencyID = "MYR" } } }
                            }
                        }),
                        UBLExtensions = new[]
                        {
                            new
                            {
                                UBLExtension = new[]
                                {
                                    new
                                    {
                                        ExtensionURI = new[] { new { _ = "urn:oasis:names:specification:ubl:dsig:enveloped:xades" } },
                                        ExtensionContent = new[]
                                        {
                                            new
                                            {
                                                UBLDocumentSignatures = new[]
                                                {
                                                    new
                                                    {
                                                        SignatureInformation = new[]
                                                        {
                                                            new
                                                            {
                                                                ID = new[] { new { _ = "urn:oasis:names:specification:ubl:signature:1" } },
                                                                ReferencedSignatureID = new[] { new { _ = "urn:oasis:names:specification:ubl:signature:Invoice" } },
                                                                Signature = new[]
                                                                {
                                                                    new
                                                                    {
                                                                        Id = "signature",
                                                                        Object = new[]
                                                                        {
                                                                            new
                                                                            {
                                                                                QualifyingProperties = new[]
                                                                                {
                                                                                    new
                                                                                    {
                                                                                        Target = "signature",
                                                                                        SignedProperties = new[]
                                                                                        {
                                                                                            new
                                                                                            {
                                                                                                Id = "id-xades-signed-props",
                                                                                                SignedSignatureProperties = new[]
                                                                                                {
                                                                                                    new
                                                                                                    {
                                                                                                        SigningTime = new[] { new { _ = "2024-07-23T15:27:47Z" } },
                                                                                                        SigningCertificate = new[]
                                                                                                        {
                                                                                                            new
                                                                                                            {
                                                                                                                Cert = new[]
                                                                                                                {
                                                                                                                    new
                                                                                                                    {
                                                                                                                        CertDigest = new[]
                                                                                                                        {
                                                                                                                            new
                                                                                                                            {
                                                                                                                                DigestMethod = new[]
                                                                                                                                {
                                                                                                                                    new { _ = "", Algorithm = "http://www.w3.org/2001/04/xmlenc#sha256" }
                                                                                                                                },
                                                                                                                                DigestValue = new[]
                                                                                                                                {
                                                                                                                                    new { _ = "KKBSTyiPKGkGl1AFqcPziKCEIDYGtnYUTQN4ukO7G40=" }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        },
                                                                                                                        IssuerSerial = new[]
                                                                                                                        {
                                                                                                                            new
                                                                                                                            {
                                                                                                                                X509IssuerName = new[] { new { _ = "CN=Trial LHDNM Sub CA V1, OU=Terms of use at http://www.posdigicert.com.my, O=LHDNM, C=MY" } },
                                                                                                                                X509SerialNumber = new[] { new { _ = "162880276254639189035871514749820882117" } }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        KeyInfo = new[]
                                                                        {
                                                                            new
                                                                            {
                                                                                X509Data = new[]
                                                                                {
                                                                                    new
                                                                                    {
                                                                                        X509Certificate = new[]
                                                                                        {
                                                                                            new { _ = "MIIFlDCCA3ygAwIBAgIQeomZorO+0AwmW2BRdWJMxTANBgkqhkiG9w0BAQsFADB1MQswCQYDVQQGEwJNWTEOMAwGA1UEChMFTEhETk0xNjA0BgNVBAsTLVRlcm1zIG9mIHVzZSBhdCBodHRwOi8vd3d3LnBvc2RpZ2ljZXJ0LmNvbS5teTEeMBwGA1UEAxMVVHJpYWwgTEhETk0gU3ViIENBIFYxMB4XDTI0MDYwNjAyNTIzNloXDTI0MDkwNjAyNTIzNlowgZwxCzAJBgNVBAYTAk1ZMQ4wDAYDVQQKEwVEdW1teTEVMBMGA1UEYRMMQzI5NzAyNjM1MDYwMRswGQYDVQQLExJUZXN0IFVuaXQgZUludm9pY2UxDjAMBgNVBAMTBUR1bW15MRIwEAYDVQQFEwlEMTIzNDU2NzgxJTAjBgkqhkiG9w0BCQEWFmFuYXMuYUBmZ3Zob2xkaW5ncy5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQChvfOzAofnU60xFO7NcmF2WRi+dgor1D7ccISgRVfZC30Fdxnt1S6ZNf78Lbrz8TbWMicS8plh/pHy96OJvEBplsAgcZTd6WvaMUB2oInC86D3YShlthR6EzhwXgBmg/g9xprwlRqXMT2p4+K8zmyJZ9pIb8Y+tQNjm/uYNudtwGVm8A4hEhlRHbgfUXRzT19QZml6V2Ea0wQI8VyWWa8phCIkBD2w4F8jG4eP5/0XSQkTfBHHf+GV/YDJx5KiiYfmB1nGfwoPHix6Gey+wRjIq87on8Dm5+8ei8/bOhcuuSlpxgwphAP3rZrNbRN9LNVLSQ5md41asoBHfaDIVPVpAgMBAAGjgfcwgfQwHwYDVR0lBBgwFgYIKwYBBQUHAwQGCisGAQQBgjcKAwwwEQYDVR0OBAoECEDwms66hrpiMFMGA1UdIARMMEowSAYJKwYBBAGDikUBMDswOQYIKwYBBQUHAgEWLWh0dHBzOi8vd3d3LnBvc2RpZ2ljZXJ0LmNvbS5teS9yZXBvc2l0b3J5L2NwczATBgNVHSMEDDAKgAhNf9lrtsUI0DAOBgNVHQ8BAf8EBAMCBkAwRAYDVR0fBD0wOzA5oDegNYYzaHR0cDovL3RyaWFsY3JsLnBvc2RpZ2ljZXJ0LmNvbS5teS9UcmlhbExIRE5NVjEuY3JsMA0GCSqGSIb3DQEBCwUAA4ICAQBwptnIb1OA8NNVotgVIjOnpQtowew87Y0EBWAnVhOsMDlWXD/s+BL7vIEbX/BYa0TjakQ7qo4riSHyUkQ+X+pNsPEqolC4uFOp0pDsIdjsNB+WG15itnghkI99c6YZmbXcSFw9E160c7vG25gIL6zBPculHx5+laE59YkmDLdxx27e0TltUbFmuq3diYBOOf7NswFcDXCo+kXOwFfgmpbzYS0qfSoh3eZZtVHg0r6uga1UsMGb90+IRsk4st99EOVENvo0290lWhPBVK2G34+2TzbbYnVkoxnq6uDMw3cRpXX/oSfya+tyF51kT3iXvpmQ9OMF3wMlfKwCS7BZB2+iRja/1WHkAP7QW7/+0zRBcGQzY7AYsdZUllwYapsLEtbZBrTiH12X4XnZjny9rLfQLzJsFGT7Q+e02GiCsBrK7ZHNTindLRnJYAo4U2at5+SjqBiXSmz0DG+juOyFkwiWyD0xeheg4tMMO2pZ7clQzKflYnvFTEFnt+d+tvVwNjTboxfVxEv2qWF6qcMJeMvXwKTXuwVI2iUqmJSzJbUY+w3OeG7fvrhUfMJPM9XZBOp7CEI1QHfHrtyjlKNhYzG3IgHcfAZUURO16gFmWgzAZLkJSmCIxaIty/EmvG5N3ZePolBOa7lNEH/eSBMGAQteH+Twtiu0Y2xSwmmsxnfJyw=="
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        }
                                    }
                                }
                            },
                        },
                        Signature = new[]
                        {
                            new
                            {
                                ID = new [] { new { _ = "urn:oasis:names:specification:ubl:signature:Invoice" } },
                                SignatureMethod = new [] { new { _ = "urn:oasis:names:specification:ubl:dsig:enveloped:xades" } }
                            }
                        }
                        }
                    }
                };


                // Step 2: Convert document to JSON string
                var documentString = JsonSerializer.Serialize(document);

                // Step 3: Convert document string to Base64
                var documentBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(documentString));

                // Step 4: Generate SHA256 hash
                using (var sha256 = SHA256.Create())
                {
                    var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(documentString));
                    var documentHashHex = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

                    // Step 5: Prepare payload for submission
                    var payload = new
                    {
                        documents = new[]
                        {
                            new
                            {
                                format = "JSON",
                                documentHash = documentHashHex,
                                codeNumber = record.Irn,
                                document = documentBase64
                            }
                        }
                    };

                    // Step 6: Get the token from the API
                    var token = await GetTokenAsync();  // Get token from LHDN API

                    if (string.IsNullOrEmpty(token))
                    {
                        return BadRequest(new { error = "Failed to generate token." });
                    }

                    // Step 7: Call document submission API
                    var client = _httpClientFactory.CreateClient();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                    var response = await client.PostAsync("https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documentsubmissions/",
new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));


                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadAsStringAsync();
                        return Ok(result);  // Successful submission
                    }
                    else
                    {
                        return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());  // Return error message
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentDocuments(
            [FromQuery] int pageNo,
            [FromQuery] int pageSize,
            [FromQuery] string submissionDateFrom,
            [FromQuery] string submissionDateTo,
            [FromQuery] string issueDateFrom,
            [FromQuery] string issueDateTo,
            [FromQuery] string direction,
            [FromQuery] string status,
            [FromQuery] string documentType,
            [FromQuery] string receiverIdType,
            [FromQuery] string receiverId,
            [FromQuery] string receiverTin,
            [FromQuery] string issuerTin,
            [FromQuery] string issuerIdType,
            [FromQuery] string issuerId)
        {
            try
            {
                // Construct the URL with query parameters
                var url = $"{apiBaseUrl}/documents/recent?" +
                    $"pageNo={pageNo}&pageSize={pageSize}&submissionDateFrom={submissionDateFrom}&submissionDateTo={submissionDateTo}" +
                    $"&issueDateFrom={issueDateFrom}&issueDateTo={issueDateTo}&direction={direction}&status={status}&documentType={documentType}" +
                    $"&receiverIdType={receiverIdType}&receiverId={receiverId}&receiverTin={receiverTin}&issuerTin={issuerTin}&issuerIdType={issuerIdType}&issuerId={issuerId}";

                // Get the token for authentication
                var token = await GetTokenAsync();

                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new { error = "Failed to generate token." });
                }

                // Call the API
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Ok(JsonSerializer.Deserialize<object>(result)); // Return the result as JSON
                }
                else
                {
                    return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/documents/{uuid}/details
        [HttpGet("{uuid}/details")]
        public async Task<IActionResult> GetDocumentDetails([FromRoute] string uuid)
        {
            try
            {
                var url = $"{apiBaseUrl}/documents/{uuid}/details";

                // Get the token for authentication
                var token = await GetTokenAsync();

                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new { error = "Failed to generate token." });
                }

                // Call the API
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return Ok(JsonSerializer.Deserialize<object>(result)); // Return the result as JSON
                }
                else
                {
                    return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // Generate Token from the API
        private async Task<string> GetTokenAsync()
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var tokenUrl = "https://preprod-api.myinvois.hasil.gov.my/connect/token";  // LHDN Token URL

                var requestContent = new StringContent(new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("client_id", "1a99eeb5-a8af-442e-9a19-f145a064583b"),  // Replace with your actual client_id
                    new KeyValuePair<string, string>("client_secret", "2911c272-9123-48a3-9d52-3c85e8e7eef0"),  // Replace with your actual client_secret
                    new KeyValuePair<string, string>("grant_type", "client_credentials"),
                    new KeyValuePair<string, string>("scope", "InvoicingAPI")
                }).ReadAsStringAsync().Result, Encoding.UTF8, "application/x-www-form-urlencoded");

                var response = await client.PostAsync(tokenUrl, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseContent);
                    return tokenResponse.AccessToken;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                // Log error (if needed) and return null
                return null;
            }
        }

        // Token response model
        public class TokenResponse
        {
            [JsonPropertyName("access_token")]
            public string AccessToken { get; set; }

            [JsonPropertyName("expires_in")]
            public int ExpiresIn { get; set; }

            [JsonPropertyName("token_type")]
            public string TokenType { get; set; }
        }
    }

    // Example of request and item classes
    public class InvoiceRequest
    {
        public string Irn { get; set; }
        public string IssueDate { get; set; }
        public string IssueTime { get; set; }
        public string InvoiceTypeCode { get; set; }
        public string CurrencyCode { get; set; }

        // New Fields
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string InvoicePeriodDescription { get; set; }
        public string BillingReferenceID { get; set; }
        public string AdditionalDocumentReferenceID { get; set; }

        // Supplier (AccountingSupplierParty) Fields
        public string SupplierAdditionalAccountID { get; set; }
        public string SupplierIndustryCode { get; set; }
        public string SupplierTIN { get; set; }
        public string SupplierBRN { get; set; }
        public string SupplierSST { get; set; }
        public string SupplierTTX { get; set; }
        public string SupplierCity { get; set; }
        public string SupplierPostalCode { get; set; }
        public string SupplierCountrySubentityCode { get; set; }
        public string SupplierAddressLine1 { get; set; }
        public string SupplierAddressLine2 { get; set; }
        public string SupplierAddressLine3 { get; set; }
        public string SupplierCountryCode { get; set; }
        public string SupplierName { get; set; }
        public string SupplierTelephone { get; set; }
        public string SupplierEmail { get; set; }

        // Customer (AccountingCustomerParty) Fields
        public string CustomerTIN { get; set; }
        public string CustomerBRN { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerPostalCode { get; set; }
        public string CustomerCountrySubentityCode { get; set; }
        public string CustomerAddressLine1 { get; set; }
        public string CustomerAddressLine2 { get; set; }
        public string CustomerAddressLine3 { get; set; }
        public string CustomerCountryCode { get; set; }
        public string CustomerName { get; set; }
        public string CustomerTelephone { get; set; }
        public string CustomerEmail { get; set; }

        // Invoice Line Items
        public decimal TotalAmount { get; set; }
        public List<Item> ItemList { get; set; }
    }

    // Item class
    public class Item
    {
        public string Id { get; set; }
        public decimal Qty { get; set; }
        public string Unit { get; set; }
        public decimal TotItemVal { get; set; }
        public string Description { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
