import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calculator, Beaker, FlaskConical, Atom } from 'lucide-react';
import { chemicalDatabase } from '../utils/mockData';

const MolarityCalculator = () => {
  const [selectedChemical, setSelectedChemical] = useState('');
  const [customMolarMass, setCustomMolarMass] = useState('');
  const [mass, setMass] = useState('');
  const [volume, setVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('L');
  const [result, setResult] = useState(null);
  const [showFormula, setShowFormula] = useState(false);

  const calculateMolarity = () => {
    if (!mass || !volume) return;
    
    const chemical = chemicalDatabase.find(c => c.id === selectedChemical);
    const molarMass = chemical ? chemical.molarMass : parseFloat(customMolarMass);
    
    if (!molarMass) return;
    
    const massInGrams = parseFloat(mass);
    const volumeInLiters = volumeUnit === 'L' ? parseFloat(volume) : parseFloat(volume) / 1000;
    
    const moles = massInGrams / molarMass;
    const molarity = moles / volumeInLiters;
    
    setResult({
      molarity: molarity.toFixed(4),
      moles: moles.toFixed(4),
      molarMass: molarMass,
      volumeInLiters: volumeInLiters,
      chemical: chemical ? chemical.name : 'Chất tùy chỉnh'
    });
  };

  useEffect(() => {
    if (mass && volume && (selectedChemical || customMolarMass)) {
      calculateMolarity();
    }
  }, [mass, volume, selectedChemical, customMolarMass, volumeUnit]);

  const resetCalculator = () => {
    setSelectedChemical('');
    setCustomMolarMass('');
    setMass('');
    setVolume('');
    setVolumeUnit('L');
    setResult(null);
    setShowFormula(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
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
                      {chemicalDatabase.map((chemical) => (
                        <SelectItem key={chemical.id} value={chemical.id}>
                          <div className="flex items-center gap-2">
                            <Atom className="w-4 h-4" />
                            <span>{chemical.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {chemical.molarMass} g/mol
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

          {/* Result Section */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MolarityCalculator;