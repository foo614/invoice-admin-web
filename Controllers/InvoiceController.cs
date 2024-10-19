using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace invoice_admin_web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

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
                            TaxCurrencyCode = new [] { new { _ = record.CurrencyCode } },
                            AccountingSupplierParty = new[]
                            {
                                new
                                {
                                    Party = new[]
                                    {
                                        new
                                        {
                                            PartyLegalEntity = new[]
                                            {
                                                new { RegistrationName = new [] { new { _ = record.SellerName } } }
                                            },
                                            PostalAddress = new[]
                                            {
                                                new
                                                {
                                                    CityName = new [] { new { _ = record.SellerCity } },
                                                    PostalZone = new [] { new { _ = record.SellerPostalCode } },
                                                    Country = new []
                                                    {
                                                        new { IdentificationCode = new [] { new { _ = record.SellerCountry } } }
                                                    }
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
                                            PartyLegalEntity = new[]
                                            {
                                                new { RegistrationName = new [] { new { _ = record.BuyerName } } }
                                            },
                                            PostalAddress = new[]
                                            {
                                                new
                                                {
                                                    CityName = new [] { new { _ = record.BuyerCity } },
                                                    PostalZone = new [] { new { _ = record.BuyerPostalCode } },
                                                    Country = new []
                                                    {
                                                        new { IdentificationCode = new [] { new { _ = record.BuyerCountry } } }
                                                    }
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
                                    new { Description = new [] { new { _ = item.Description } } }
                                },
                                Price = new []
                                {
                                    new { PriceAmount = new [] { new { _ = item.UnitPrice, currencyID = "MYR" } } }
                                }
                            }),
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
                    var documentHash = sha256.ComputeHash(Encoding.UTF8.GetBytes(documentBase64));
                    var documentHashHex = BitConverter.ToString(documentHash).Replace("-", "").ToLower();

                    // Step 5: Prepare payload for submission
                    var payload = new
                    {
                        format = "JSON",
                        documentHash = documentHashHex,
                        codeNumber = record.Irn,
                        document = documentBase64
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

                    var response = await client.PostAsync("https://preprod-api.myinvois.hasil.gov.my/api/v1.0/documentsubmissions",
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
        public string SellerName { get; set; }
        public string SellerCity { get; set; }
        public string SellerPostalCode { get; set; }
        public string SellerCountry { get; set; }
        public string BuyerName { get; set; }
        public string BuyerCity { get; set; }
        public string BuyerPostalCode { get; set; }
        public string BuyerCountry { get; set; }
        public decimal TotalAmount { get; set; }
        public List<Item> ItemList { get; set; }
    }

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
