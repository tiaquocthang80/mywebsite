import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calculator, Beaker, FlaskConical, Atom, History, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MolarityCalculator = () => {
  const [chemicals, setChemicals] = useState([]);
  const [selectedChemical, setSelectedChemical] = useState('');
  const [customMolarMass, setCustomMolarMass] = useState('');
  const [mass, setMass] = useState('');
  const [volume, setVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('L');
  const [result, setResult] = useState(null);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [showFormula, setShowFormula] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load chemicals from backend
  useEffect(() => {
    loadChemicals();
    loadCalculationHistory();
  }, []);

  const loadChemicals = async () => {
    try {
      const response = await axios.get(`${API}/chemicals`);
      setChemicals(response.data);
    } catch (error) {
      console.error('Error loading chemicals:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách chất hóa học",
        variant: "destructive"
      });
    }
  };

  const loadCalculationHistory = async () => {
    try {
      const response = await axios.get(`${API}/calculations?limit=20`);
      setCalculationHistory(response.data);
    } catch (error) {
      console.error('Error loading calculation history:', error);
    }
  };

  const calculateMolarity = async () => {
    if (!mass || !volume) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng nhập đầy đủ khối lượng và thể tích",
        variant: "destructive"
      });
      return;
    }

    if (!selectedChemical && !customMolarMass) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng chọn chất hóa học hoặc nhập khối lượng mol phân tử",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        chemical_id: selectedChemical || null,
        custom_molar_mass: customMolarMass ? parseFloat(customMolarMass) : null,
        mass: parseFloat(mass),
        volume: parseFloat(volume),
        volume_unit: volumeUnit
      };

      const response = await axios.post(`${API}/calculate`, requestData);
      const calculation = response.data;
      
      setResult({
        molarity: calculation.molarity.toFixed(4),
        moles: calculation.moles.toFixed(4),
        molarMass: calculation.molar_mass,
        volumeInLiters: calculation.volume_in_liters,
        chemical: calculation.chemical_name
      });

      // Reload calculation history
      loadCalculationHistory();
      
      toast({
        title: "Tính toán thành công",
        description: `Nồng độ mol: ${calculation.molarity.toFixed(4)} M`,
      });

    } catch (error) {
      console.error('Error calculating:', error);
      const errorMessage = error.response?.data?.detail || "Có lỗi xảy ra khi tính toán";
      toast({
        title: "Lỗi tính toán",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${API}/calculations`);
      setCalculationHistory([]);
      toast({
        title: "Đã xóa",
        description: "Lịch sử tính toán đã được xóa",
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa lịch sử tính toán",
        variant: "destructive"
      });
    }
  };

  const resetCalculator = () => {
    setSelectedChemical('');
    setCustomMolarMass('');
    setMass('');
    setVolume('');
    setVolumeUnit('L');
    setResult(null);
    setShowFormula(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tính Nồng Độ Mol
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Công cụ tính toán nồng độ mol của dung dịch</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Thông Tin Tính Toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chemical Selection */}
                <div className="space-y-2">
                  <Label htmlFor="chemical" className="text-sm font-medium">
                    Chọn chất hóa học
                  </Label>
                  <Select value={selectedChemical} onValueChange={setSelectedChemical}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn chất hóa học từ danh sách" />
                    </SelectTrigger>
                    <SelectContent>
                      {chemicals.map((chemical) => (
                        <SelectItem key={chemical.id} value={chemical.id}>
                          <div className="flex items-center gap-2">
                            <Atom className="w-4 h-4" />
                            <span>{chemical.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {chemical.molar_mass} g/mol
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Molar Mass */}
                {!selectedChemical && (
                  <div className="space-y-2">
                    <Label htmlFor="customMolarMass" className="text-sm font-medium">
                      Khối lượng mol phân tử (g/mol)
                    </Label>
                    <Input
                      id="customMolarMass"
                      type="number"
                      value={customMolarMass}
                      onChange={(e) => setCustomMolarMass(e.target.value)}
                      placeholder="Nhập khối lượng mol phân tử"
                      className="w-full"
                    />
                  </div>
                )}

                {/* Mass Input */}
                <div className="space-y-2">
                  <Label htmlFor="mass" className="text-sm font-medium">
                    Khối lượng chất tan (g)
                  </Label>
                  <Input
                    id="mass"
                    type="number"
                    value={mass}
                    onChange={(e) => setMass(e.target.value)}
                    placeholder="Nhập khối lượng chất tan"
                    className="w-full"
                  />
                </div>

                {/* Volume Input */}
                <div className="space-y-2">
                  <Label htmlFor="volume" className="text-sm font-medium">
                    Thể tích dung dịch
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="volume"
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="Nhập thể tích"
                      className="flex-1"
                    />
                    <Select value={volumeUnit} onValueChange={setVolumeUnit}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="mL">mL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={calculateMolarity}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Đang tính...' : 'Tính Toán'}
                  </Button>
                  <Button
                    onClick={() => setShowFormula(!showFormula)}
                    variant="outline"
                    className="flex-1"
                  >
                    {showFormula ? 'Ẩn' : 'Hiện'} Công Thức
                  </Button>
                  <Button
                    onClick={resetCalculator}
                    variant="outline"
                    className="flex-1"
                  >
                    Đặt Lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Formula Display */}
            {showFormula && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-700">Công Thức Tính Toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white/70 rounded-lg">
                      <p className="font-medium text-purple-800">Số mol:</p>
                      <p className="text-purple-600">n = m / M</p>
                    </div>
                    <div className="p-3 bg-white/70 rounded-lg">
                      <p className="font-medium text-purple-800">Nồng độ mol:</p>
                      <p className="text-purple-600">C = n / V</p>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      <p>n: số mol (mol)</p>
                      <p>m: khối lượng chất tan (g)</p>
                      <p>M: khối lượng mol phân tử (g/mol)</p>
                      <p>C: nồng độ mol (M)</p>
                      <p>V: thể tích dung dịch (L)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Result Display */}
            {result && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                    <Beaker className="w-5 h-5" />
                    Kết Quả Tính Toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {result.molarity} M
                      </div>
                      <p className="text-sm text-gray-600">Nồng độ mol</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Chất hóa học:</span>
                        <span className="text-sm">{result.chemical}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Số mol:</span>
                        <span className="text-sm">{result.moles} mol</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Khối lượng mol:</span>
                        <span className="text-sm">{result.molarMass} g/mol</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Thể tích dung dịch:</span>
                        <span className="text-sm">{result.volumeInLiters} L</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History Toggle */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    Lịch Sử Tính Toán
                  </div>
                  <Button
                    onClick={() => setShowHistory(!showHistory)}
                    variant="ghost"
                    size="sm"
                  >
                    {showHistory ? 'Ẩn' : 'Hiện'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showHistory && (
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {calculationHistory.length} tính toán
                      </span>
                      {calculationHistory.length > 0 && (
                        <Button
                          onClick={clearHistory}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {calculationHistory.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Chưa có lịch sử tính toán
                        </p>
                      ) : (
                        calculationHistory.map((calc, index) => (
                          <div key={calc.id} className="p-3 bg-gray-50 rounded-lg text-xs">
                            <div className="font-medium">{calc.chemical_name}</div>
                            <div className="text-gray-600">
                              {calc.mass}g → {calc.molarity.toFixed(4)}M
                            </div>
                            <div className="text-gray-500">
                              {formatDate(calc.created_at)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MolarityCalculator;