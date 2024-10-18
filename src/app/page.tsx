// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { P } from "@/components/ui/typography";
// import { geistSans } from "@/lib/font";
// import { cn } from "@/lib/utils";
// import { ChevronRight, PieChart, Shield, Star, TrendingUp } from "lucide-react";
// import Link from "next/link";

// const Page = () => {
//   return (
//     <main
//       className={cn("relative min-h-screen bg-background", geistSans.className)}
//     >
//       <div className="absolute inset-0 h-screen [background:radial-gradient(125%_125%_at_50%_10%,transparent_35%,#ff8000_500%)]" />

//       <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background pt-24">
//         <div className="flex flex-col min-h-screen w-full">
//           <section className="w-full mx-auto  py-40 md:py-24 lg:py-32 xl:py-48">
//             <div className="mx-auto w-full px-4 md:px-6">
//               <div className="flex flex-col items-center space-y-4 text-center">
//                 <div className="space-y-2">
//                   <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl ">
//                     Trade Smarter with TradePro
//                   </h1>
//                   <P className="mx-auto max-w-prose text-lg  ">
//                     Advanced analytics, real-time data, and AI-powered insights
//                     for successful trading in today&apos;s dynamic financial
//                     markets.
//                   </P>
//                 </div>
//                 <div className="space-x-4">
//                   <Button asChild>
//                     <Link href="/login">Get Started</Link>
//                   </Button>
//                   <Button variant="outline">Learn More</Button>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <section className="relative mx-auto w-full px-4 py-16 sm:px-6 lg:px-8 bg-[#fff8f4]">
//             <svg
//               viewBox="0 0 1440 58"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="absolute left-0 top-0 w-full bg-[#fff8f4]"
//             >
//               <path
//                 d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
//                 fill="#ffffff"
//               ></path>
//             </svg>
//             <section
//               id="features"
//               className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32  "
//             >
//               <div className="mx-auto w-full px-4 md:px-6">
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
//                   Key Features
//                 </h2>
//                 <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
//                   <Card>
//                     <CardHeader>
//                       <PieChart className="w-10 h-10 mb-2" />
//                       <CardTitle>Advanced Analytics</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p>
//                         Gain deep insights with our cutting-edge analytical
//                         tools and visualizations.
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardHeader>
//                       <TrendingUp className="w-10 h-10 mb-2" />
//                       <CardTitle>Real-Time Data</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p>
//                         Access up-to-the-second market data for informed
//                         decision-making.
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardHeader>
//                       <Shield className="w-10 h-10 mb-2" />
//                       <CardTitle>Secure Trading</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p>
//                         Trade with confidence using our state-of-the-art
//                         security measures.
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </section>

//             <section
//               id="pricing"
//               className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32"
//             >
//               <div className="mx-auto w-full px-4 md:px-6">
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
//                   Pricing Plans
//                 </h2>
//                 <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Basic</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-4xl font-bold">$29/mo</p>
//                       <ul className="mt-4 space-y-2">
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> Real-time
//                           data
//                         </li>
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> Basic
//                           analytics
//                         </li>
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> 5 trades per
//                           day
//                         </li>
//                       </ul>
//                       <Button className="mt-6 w-full">Choose Plan</Button>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Pro</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-4xl font-bold">$99/mo</p>
//                       <ul className="mt-4 space-y-2">
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> Advanced
//                           analytics
//                         </li>
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> AI-powered
//                           insights
//                         </li>
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> Unlimited
//                           trades
//                         </li>
//                       </ul>
//                       <Button className="mt-6 w-full">Choose Plan</Button>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Enterprise</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-4xl font-bold">Custom</p>
//                       <ul className="mt-4 space-y-2">
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> Custom
//                           solutions
//                         </li>
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> Dedicated
//                           support
//                         </li>
//                         <li className="flex items-center">
//                           <ChevronRight className="mr-2 h-4 w-4" /> API access
//                         </li>
//                       </ul>
//                       <Button className="mt-6 w-full">Contact Sales</Button>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </section>
//             <section
//               id="testimonials"
//               className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32  "
//             >
//               <div className="mx-auto w-full px-4 md:px-6">
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
//                   What Our Clients Say
//                 </h2>
//                 <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
//                   <Card>
//                     <CardContent className="pt-4">
//                       <div className="flex items-center mb-4">
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                       </div>
//                       <p className="mb-4">
//                         &quot;TradePro has revolutionized my trading strategy.
//                         The real-time data and advanced analytics have given me
//                         a significant edge in the market.&quot;
//                       </p>
//                       <p className="font-semibold">- Sarah J., Day Trader</p>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="pt-4">
//                       <div className="flex items-center mb-4">
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                       </div>
//                       <p className="mb-4">
//                         &quot;The AI-powered insights have been a game-changer
//                         for our firm. We&apos;ve seen a 30% increase in
//                         successful trades since adopting TradePro.&quot;
//                       </p>
//                       <p className="font-semibold">
//                         - Mark R., Hedge Fund Manager
//                       </p>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="pt-4">
//                       <div className="flex items-center mb-4">
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                         <Star className="w-5 h-5 fill-current text-yellow-500" />
//                       </div>
//                       <p className="mb-4">
//                         &quot;As a beginner, TradePro&apos;s user-friendly
//                         interface and educational resources have been
//                         invaluable. I feel more confident in my trading
//                         decisions.&quot;
//                       </p>
//                       <p className="font-semibold">
//                         - Emily L., Novice Investor
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//               <svg
//                 viewBox="0 0 1440 58"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="absolute bottom-0 left-0"
//               >
//                 <path
//                   transform="rotate(180) translate(-1440, -60)"
//                   d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
//                   fill="#ffffff"
//                 ></path>
//               </svg>
//             </section>
//           </section>
//           <section className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32">
//             <div className="mx-auto w-full px-4 md:px-6">
//               <div className="flex flex-col items-center space-y-4 text-center">
//                 <div className="space-y-2">
//                   <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//                     Ready to Transform Your Trading?
//                   </h2>
//                   <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
//                     Join thousands of successful traders who have elevated their
//                     game with TradePro.
//                   </p>
//                 </div>
//                 <Button size="lg" className="mt-4">
//                   Start Your Free Trial
//                 </Button>
//               </div>
//             </div>
//           </section>

//           <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               © 2024 TradePro Inc. All rights reserved.
//             </p>
//             <nav className="sm:ml-auto flex gap-4 sm:gap-6">
//               <Link
//                 className="text-xs hover:underline underline-offset-4"
//                 href="#"
//               >
//                 Terms of Service
//               </Link>
//               <Link
//                 className="text-xs hover:underline underline-offset-4"
//                 href="#"
//               >
//                 Privacy
//               </Link>
//             </nav>
//           </footer>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Page;

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { P } from "@/components/ui/typography";
import { geistSans } from "@/lib/font";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  PieChart,
  Shield,
  Star,
  TrendingUp,
  BarChart,
  Globe,
  Zap,
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <main
      className={cn("relative min-h-screen bg-background", geistSans.className)}
    >
      <div className="absolute inset-0 h-screen [background:radial-gradient(125%_125%_at_50%_10%,transparent_35%,#4a90e2_500%)]" />

      <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background pt-24">
        <div className="flex flex-col min-h-screen w-full">
          <section className="w-full max-w-5xl mx-auto py-40 md:py-24 lg:py-32 xl:py-48">
            <div className="mx-auto w-full px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Streamline Your Asset Management with Assets Bridge
                  </h1>
                  <P className="mx-auto max-w-prose text-lg">
                    Powerful tools for seamless asset tracking, real-time
                    analytics, and intelligent insights across global markets.
                  </P>
                </div>
                <div className="space-x-4">
                  <Button asChild>
                    <Link href="/login">Get Started</Link>
                  </Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
            </div>
          </section>

          <section className="relative mx-auto w-full px-4 py-16 sm:px-6 lg:px-8 bg-[#f0f7ff]">
            <svg
              viewBox="0 0 1440 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-0 top-0 w-full bg-[#f0f7ff]"
            >
              <path
                d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
                fill="#ffffff"
              ></path>
            </svg>
            <section
              id="features"
              className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32"
            >
              <div className="mx-auto w-full px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                  Key Features
                </h2>
                <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                  <Card>
                    <CardHeader>
                      <BarChart className="w-10 h-10 mb-2 text-primary" />
                      <CardTitle>Advanced Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Gain deep insights with our cutting-edge analytical
                        tools and visualizations for informed decision-making.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Globe className="w-10 h-10 mb-2 text-primary" />
                      <CardTitle>Global Asset Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Monitor and manage your assets across multiple markets
                        and jurisdictions in real-time.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Zap className="w-10 h-10 mb-2 text-primary" />
                      <CardTitle>Intelligent Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Leverage AI-powered recommendations to optimize your
                        asset allocation and performance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            <section
              id="pricing"
              className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32"
            >
              <div className="mx-auto w-full px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                  Pricing Plans
                </h2>
                <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                  <Card>
                    <CardHeader>
                      <CardTitle>Starter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">$49/mo</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> Real-time
                          asset tracking
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> Basic
                          analytics
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> Up to 100
                          assets
                        </li>
                      </ul>
                      <Button className="mt-6 w-full">Choose Plan</Button>
                    </CardContent>
                  </Card>
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Professional</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">$149/mo</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> Advanced
                          analytics
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> AI-powered
                          insights
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> Unlimited
                          assets
                        </li>
                      </ul>
                      <Button className="mt-6 w-full">Choose Plan</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Enterprise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">Custom</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> Custom
                          solutions
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> Dedicated
                          support
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" /> API access
                        </li>
                      </ul>
                      <Button className="mt-6 w-full">Contact Sales</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
            <section
              id="testimonials"
              className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32"
            >
              <div className="mx-auto w-full px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
                  What Our Clients Say
                </h2>
                <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-current text-yellow-500"
                          />
                        ))}
                      </div>
                      <p className="mb-4">
                        "Assets Bridge has transformed our asset management
                        strategy. The global tracking and advanced analytics
                        have given us unprecedented visibility and control."
                      </p>
                      <p className="font-semibold">
                        - Sarah J., Portfolio Manager
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-current text-yellow-500"
                          />
                        ))}
                      </div>
                      <p className="mb-4">
                        "The AI-powered insights have been a game-changer for
                        our firm. We've optimized our asset allocation and seen
                        a significant increase in portfolio performance."
                      </p>
                      <p className="font-semibold">
                        - Mark R., Investment Director
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-current text-yellow-500"
                          />
                        ))}
                      </div>
                      <p className="mb-4">
                        "As a growing investment firm, Assets Bridge's scalable
                        solution and user-friendly interface have been
                        invaluable. It's streamlined our operations and improved
                        our decision-making process."
                      </p>
                      <p className="font-semibold">
                        - Emily L., Chief Investment Officer
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <svg
                viewBox="0 0 1440 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-0 left-0"
              >
                <path
                  transform="rotate(180) translate(-1440, -60)"
                  d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
                  fill="#ffffff"
                ></path>
              </svg>
            </section>
          </section>
          <section className="max-w-6xl mx-auto py-12 md:py-24 lg:py-32">
            <div className="mx-auto w-full px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Ready to Revolutionize Your Asset Management?
                  </h2>
                  <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Join thousands of successful investors who have optimized
                    their portfolios with Assets Bridge.
                  </p>
                </div>
                <Button size="lg" className="mt-4">
                  Start Your Free Trial
                </Button>
              </div>
            </div>
          </section>

          <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 Assets Bridge Inc. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link
                className="text-xs hover:underline underline-offset-4"
                href="#"
              >
                Terms of Service
              </Link>
              <Link
                className="text-xs hover:underline underline-offset-4"
                href="#"
              >
                Privacy
              </Link>
            </nav>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Page;
