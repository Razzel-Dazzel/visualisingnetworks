import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.lang.Math;

public class averagefinder {
    
    public static void main(String[] args) throws IOException{
        ArrayList<Double> avgSpace = new ArrayList<Double>();
        BufferedReader reader;
        
        
		try {
			reader = new BufferedReader(new FileReader
            ("spaceData.txt"));
            String line = reader.readLine();

            while (line != null) {
                String[] values = line.split("\t");
                System.out.println(Double.parseDouble(values[1]));
                Double avgValue = Math.abs(Double.parseDouble(values[0])) - Math.abs(Double.parseDouble(values[1]));
                //System.out.println(avgValue);
                avgSpace.add(avgValue);
                // read next line
                line = reader.readLine();
                //System.out.println(line);
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
        Double largest = 0.0;
        for (Double value : avgSpace) {
            if(value > largest){
                largest = value;
            };
        }
        //System.out.println(largest);
    }
}
