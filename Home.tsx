import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import policiesData from "@/data/policies.json";
import { Search, ExternalLink, Filter, X, ChevronRight } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  const filteredPolicies = useMemo(() => {
    return policiesData.policies.filter((policy) => {
      const matchesCategory = !selectedCategory || policy.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.latestNotice.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    policiesData.policies.forEach((policy) => {
      stats[policy.category] = (stats[policy.category] || 0) + 1;
    });
    return stats;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">信来企服</h1>
              <p className="text-sm text-slate-600 mt-1">福建企业政策速查平台</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{policiesData.policies.length}</p>
              <p className="text-sm text-slate-600">项政策</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              placeholder="搜索政策名称、通知、部门..."
              className="pl-10 pr-10 h-10 bg-slate-100 border-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">政策分类</h2>
              </div>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => setSelectedCategory(null)}
                >
                  <span>全部政策</span>
                  <Badge variant="secondary" className="ml-auto">{policiesData.policies.length}</Badge>
                </Button>
                {policiesData.categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="ml-auto">{categoryStats[category.id] || 0}</Badge>
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedPolicy ? (
              // Policy Detail View
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  className="mb-4"
                  onClick={() => setSelectedPolicy(null)}
                >
                  ← 返回列表
                </Button>

                <Card className="border-slate-200 shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{selectedPolicy.title}</CardTitle>
                        <CardDescription className="text-base mb-4">
                          {selectedPolicy.latestNotice}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{selectedPolicy.department}</Badge>
                          <Badge variant="outline">{selectedPolicy.releaseDate}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">政策解读</h3>
                      <p className="text-slate-700 leading-relaxed">{selectedPolicy.summary}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">主要优惠</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPolicy.benefits.map((benefit: string, idx: number) => (
                          <Badge key={idx} variant="default" className="bg-green-100 text-green-800">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">申报对象</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPolicy.applicants.map((applicant: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {applicant}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex gap-3">
                      <a
                        href={selectedPolicy.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          查看官方通知原文
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Policy List View
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    {selectedCategory
                      ? policiesData.categories.find((c) => c.id === selectedCategory)?.name
                      : "全部政策"}
                  </h2>
                  <p className="text-slate-600">
                    共 {filteredPolicies.length} 项政策
                  </p>
                </div>

                <div className="grid gap-4">
                  {filteredPolicies.length > 0 ? (
                    filteredPolicies.map((policy) => (
                      <Card
                        key={policy.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow border-slate-200"
                        onClick={() => setSelectedPolicy(policy)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">{policy.title}</CardTitle>
                              <CardDescription className="text-sm line-clamp-2">
                                {policy.latestNotice}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="ml-2 flex-shrink-0">
                              {policy.releaseDate}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 text-sm line-clamp-2 mb-3">
                            {policy.summary}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {policy.benefits.slice(0, 2).map((benefit: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                              {policy.benefits.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{policy.benefits.length - 2}
                                </Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              查看详情 <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-slate-200">
                      <CardContent className="py-12 text-center">
                        <p className="text-slate-600 mb-2">未找到相关政策</p>
                        <p className="text-sm text-slate-500">请尝试修改搜索条件</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600 text-sm">
          <p>信来企服 © 2025 | 福建企业政策速查平台</p>
          <p className="mt-2">数据来源：福建省各级政府官网</p>
        </div>
      </footer>
    </div>
  );
}
