"use client"

import { useState } from "react";
import { Upload, Shield, AlertTriangle, CheckCircle, Loader2, ExternalLink, FileText, ArrowRight, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface URLFeatures {
  [key: string]: number;
}

interface AnalysisResult {
  url: string;
  prediction: string;
  is_safe: boolean;
  features: URLFeatures;
}

const featureDescriptions: { [key: string]: string } = {
  f1: "Full URL Length",
  f2: "Hostname Length",
  f3: "IP Address Present",
  f4: "Count of Dots",
  f5: "Count of Hyphens",
  f6: "Count of @ Symbols",
  f7: "Count of Question Marks",
  f8: "Count of & Symbols",
  f9: "Count of | Symbols",
  f10: "Count of = Symbols",
  f11: "Count of Underscores",
  f12: "Count of Tilde Symbols",
  f13: "Count of % Symbols",
  f14: "Count of Forward Slashes",
  f15: "Count of * Symbols",
  f16: "Count of Colons",
  f17: "Count of Commas",
  f18: "Count of Semicolons",
  f19: "Count of $ Symbols",
  f20: "Count of Spaces",
  f21: "Count of WWW",
  f22: "Count of .com",
  f23: "Count of HTTP",
  f24: "Count of //",
  f25: "HTTPS Present",
  f26: "Ratio of Digits in URL",
  f27: "Ratio of Digits in Hostname",
  f28: "Punycode Present",
  f29: "Port Present",
  f30: "TLD in Path",
  f31: "TLD in Subdomain",
  f32: "Abnormal Subdomains",
  f33: "Number of Subdomains",
  f34: "Prefix/Suffix Present",
  f35: "Random String Domain",
  f36: "URL Shortening Service",
  f37: "Suspicious Path Extension",
  f38: "Total Redirections",
  f39: "External Redirections",
  f40: "Number of Words in URL",
  f41: "Character Repetition",
  f42: "Shortest Word Length (URL)",
  f43: "Shortest Word Length (Hostname)",
  f44: "Shortest Word Length (Path)",
  f45: "Longest Word Length (URL)",
  f46: "Longest Word Length (Hostname)",
  f47: "Longest Word Length (Path)",
  f48: "Average Word Length (URL)",
  f49: "Average Word Length (Hostname)",
  f50: "Average Word Length (Path)",
  f51: "Phishing Keywords Count",
  f52: "Brand in Domain",
  f53: "Brand in Subdomain",
  f54: "Brand in Path",
  f55: "Suspicious TLD",
  f56: "Statistical Report",
  f57: "Number of Hyperlinks",
  f58: "Internal Links Ratio",
  f59: "External Links Ratio",
  f60: "Null Links Ratio",
  f61: "External CSS Count",
  f62: "Internal Redirects",
  f63: "External Redirects",
  f64: "Internal Link Errors",
  f65: "External Link Errors",
  f66: "Suspicious Login Form",
  f67: "External Favicon",
  f68: "Links in Tags Ratio",
  f69: "Submit to Email",
  f70: "Internal Media Ratio",
  f71: "External Media Ratio",
  f72: "Suspicious Form Handler",
  f73: "Invisible iFrame",
  f74: "Pop-up Window",
  f75: "Safe Anchor Count",
  f76: "Mouse Over Detection",
  f77: "Right Click Disabled",
  f78: "Empty Title",
  f79: "Domain in Title",
  f80: "Domain in Copyright"
};

const featureCategories = {
  "URL Structure": ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10"],
  "Special Characters": ["f11", "f12", "f13", "f14", "f15", "f16", "f17", "f18", "f19", "f20"],
  "Domain Features": ["f21", "f22", "f23", "f24", "f25", "f26", "f27", "f28", "f29", "f30"],
  "Path Analysis": ["f31", "f32", "f33", "f34", "f35", "f36", "f37", "f38", "f39", "f40"],
  "Word Analysis": ["f41", "f42", "f43", "f44", "f45", "f46", "f47", "f48", "f49", "f50"],
  "Brand & Keywords": ["f51", "f52", "f53", "f54", "f55", "f56"],
  "HTML Content": ["f57", "f58", "f59", "f60", "f61", "f62", "f63", "f64", "f65"],
  "Security Features": ["f66", "f67", "f68", "f69", "f70", "f71", "f72", "f73", "f74", "f75"],
  "User Interface": ["f76", "f77", "f78", "f79", "f80"]
};

const Index = () => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("url", url);

      const response = await fetch("https://mentally-ready-haddock.ngrok-free.app/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);

      toast({
        title: data.is_safe ? "URL Analysis Complete" : "Warning: Potential Threat Detected",
        description: `The URL ${data.is_safe ? "appears to be safe" : "may be malicious"}`,
        variant: data.is_safe ? "default" : "destructive",
      });
    } catch (err) {
      setError("Failed to analyze URL. Please try again.");
      toast({
        title: "Analysis Failed",
        description: "Could not complete URL analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(" https://mentally-ready-haddock.ngrok-free.app/bulk-analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Bulk analysis failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "url_analysis_results.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Bulk Analysis Complete",
        description: "Analysis results have been downloaded as a CSV file.",
      });
    } catch (err) {
      setError("Failed to analyze CSV file. Please try again.");
      toast({
        title: "Bulk Analysis Failed",
        description: "Could not complete bulk URL analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">

          {/* Institute Information */}
          <div className="mb-10 glass-card mx-auto max-w-3xl py-8 px-8 rounded-2xl shadow-xl border-2 border-purple-100 dark:border-purple-900/30 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-4 tracking-tight">
              National Institute of Technology Karnataka, Surathkal
            </h3>
            <h4 className="text-2xl text-purple-700 dark:text-purple-400 mb-3">
              Department of Information Technology
            </h4>
            <p className="text-md text-purple-600 dark:text-purple-500 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 inline-block rounded-full">
              Information Assurance and Security (IT352) Course Project
            </p>
          </div>

          <p className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 mb-6 drop-shadow-lg">
            Advanced phishing detection using Tiny-BERT and machine learning algorithms
          </p>

          {/* Researchers and Guide Section */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 mb-12">
            <div className="glass-card flex flex-col items-center p-8 rounded-xl min-w-[240px] transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-purple-100 dark:border-purple-900/30">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">Guide</Badge>
              <BookOpen className="h-10 w-10 text-indigo-500 dark:text-indigo-400 mb-3" />
              <p className="font-semibold text-xl text-slate-800 dark:text-slate-200 mb-2">Prof Jaidhar C D</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full mt-1">Faculty Mentor</p>
            </div>
            <div className="glass-card flex flex-col items-center p-8 rounded-xl min-w-[240px] transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-purple-100 dark:border-purple-900/30">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">Student</Badge>
              <User className="h-10 w-10 text-purple-500 dark:text-purple-400 mb-3" />
              <p className="font-semibold text-xl text-slate-800 dark:text-slate-200 mb-2">Praveen Kumar</p>
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full mt-1">221IT052</p>
            </div>

            <div className="glass-card flex flex-col items-center p-8 rounded-xl min-w-[240px] transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-purple-100 dark:border-purple-900/30">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">Student</Badge>
              <User className="h-10 w-10 text-purple-500 dark:text-purple-400 mb-3" />
              <p className="font-semibold text-xl text-slate-800 dark:text-slate-200 mb-2">Sagar Athani</p>
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full mt-1">221IT058</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-2xl border-0 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden animate-scale-in">
          <CardContent className="p-0">
            <Tabs defaultValue="single" className="w-full">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-4 border-b">
                <TabsList className="grid w-full grid-cols-2 h-14">
                  <TabsTrigger value="single" className="text-base rounded-l-lg">
                    <Shield className="h-5 w-5 mr-2" />
                    Single URL
                  </TabsTrigger>
                  <TabsTrigger value="bulk" className="text-base rounded-r-lg">
                    <FileText className="h-5 w-5 mr-2" />
                    Bulk Analysis
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-8">
                <TabsContent value="single" className="mt-0 space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Analyze URL</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Enter a URL to detect potential phishing or malicious content
                    </p>
                  </div>

                  <form onSubmit={analyzeUrl} className="space-y-6">
                    <div className="flex gap-3">
                      <div className="relative flex-1 group">
                        <Input
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="pr-10 h-14 border-slate-300 dark:border-slate-700 focus-visible:ring-blue-500 text-base"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ExternalLink className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
                        </div>
                      </div>

                      {!result ? (
                        <Button
                          type="submit"
                          disabled={loading || !url}
                          className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-base"
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            <Shield className="mr-2 h-5 w-5" />
                          )}
                          {loading ? "Analyzing..." : "Analyze"}
                          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => {
                            setResult(null);
                            setUrl(""); // Optional: clear the URL input as well
                          }}
                          className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-base"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </form>

                  {/* Results Section */}
                  {result && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200">Analysis Result</h3>
                        <Badge
                          variant={result.is_safe ? "outline" : "destructive"}
                          className={result.is_safe ?
                            "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30 px-3 py-1 text-sm" :
                            "px-3 py-1 text-sm"}
                        >
                          {result.is_safe ? "Safe" : "Potentially Malicious"}
                        </Badge>
                      </div>

                      <Alert
                        variant={result.is_safe ? "default" : "destructive"}
                        className={result.is_safe ?
                          "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 shadow-md" :
                          "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 shadow-md"
                        }
                      >
                        {result.is_safe ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        <AlertTitle className={result.is_safe ?
                          "text-green-800 dark:text-green-300 text-lg" :
                          "text-red-800 dark:text-red-300 text-lg"
                        }>
                          {result.is_safe ? "Safe URL Detected" : "Warning: Potential Phishing"}
                        </AlertTitle>
                        <AlertDescription className={result.is_safe ?
                          "text-green-700 dark:text-green-400" :
                          "text-red-700 dark:text-red-400"
                        }>
                          <div className="flex flex-col gap-1 mt-1">
                            <span>Classification: <strong>{result.prediction}</strong></span>
                            <span>URL: <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded">{result.url}</span></span>
                          </div>
                        </AlertDescription>
                      </Alert>

                      <div>
                        <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">URL Feature Analysis</h3>
                        <Accordion type="single" collapsible className="w-full rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md">
                          {Object.entries(featureCategories).map(([category, features], index) => (
                            <AccordionItem
                              value={`item-${index}`}
                              key={index}
                              className="border-slate-200 dark:border-slate-700"
                            >
                              <AccordionTrigger className="px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200">
                                {category}
                              </AccordionTrigger>
                              <AccordionContent className="px-4 py-3">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[70%] text-slate-700 dark:text-slate-300">Feature</TableHead>
                                      <TableHead className="text-slate-700 dark:text-slate-300">Value</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {features.map((feature) => (
                                      <TableRow key={feature} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                        <TableCell className="font-medium text-slate-800 dark:text-slate-200">{featureDescriptions[feature]}</TableCell>
                                        <TableCell className="text-right font-mono text-slate-700 dark:text-slate-300">
                                          {Math.round(result.features?.[feature] || 0)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="bulk" className="mt-0 space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-200">Bulk URL Analysis</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Upload a CSV file with multiple URLs to analyze in batch
                    </p>
                  </div>

                  <form onSubmit={analyzeBulk} className="space-y-6">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="h-14 border-slate-300 dark:border-slate-700 focus-visible:ring-blue-500 text-base file:bg-blue-100 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 file:rounded-md file:border-0 file:px-4 file:py-2 file:mr-4 file:h-full"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading || !file}
                        className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-base"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-5 w-5" />
                        )}
                        {loading ? "Processing..." : "Upload & Analyze"}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </form>

                  <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 shadow-md">
                    <FileText className="h-5 w-5" />
                    <AlertTitle className="text-lg">CSV Format Requirements</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                      <ol className="list-decimal list-inside space-y-2 mt-2">
                        <li>The CSV file must contain a column named "url" with the URLs to analyze</li>
                        <li>Each URL should be on a separate row</li>
                        <li>Results will be downloaded automatically as a CSV file</li>
                        <li>Large files may take several minutes to process</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>

          <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-t p-5 text-sm text-center text-slate-600 dark:text-slate-400">
            <div className="w-full">
              Academic Session January-April 2025 | National Institute of Technology Karnataka, Surathkal
            </div>
          </CardFooter>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-8 shadow-md animate-fade-in">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Index;
