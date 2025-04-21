
import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [passwordTimeout, setPasswordTimeout] = useState("15");
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  
  return (
    <div className="flex-1">
      <Header title="Settings" />
      
      <div className="px-8 py-6">
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid grid-cols-1 w-[200px]">
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security settings for the access vault.
                  <br />
                  <span className="text-xs text-muted-foreground">
                    (Note: Two-Factor Authentication is a UI setting only. No actual second factor is enforced yet.)
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactor} 
                    onCheckedChange={setTwoFactor} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timeout">Auto-hide Password After</Label>
                  <Select 
                    value={passwordTimeout} 
                    onValueChange={setPasswordTimeout}
                  >
                    <SelectTrigger id="timeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Passwords will automatically be hidden after this duration
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="session">Session Timeout</Label>
                  <Select 
                    value={sessionTimeout} 
                    onValueChange={setSessionTimeout}
                  >
                    <SelectTrigger id="session">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    You'll be automatically logged out after this period of inactivity
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Security Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

